import { Component, EventEmitter, Input, Output, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../core/services/teacher-exam-service';
// KeyboardNav directive இருந்தால் அதை import செய்யவும், இல்லையெனில் நீக்கிவிடலாம்
import { KeyboardNav } from "../../core/directives/accessibility/keyboard-nav"; 

@Component({
  selector: 'app-student-exam',
  standalone: true,
  imports: [CommonModule, KeyboardNav],
  templateUrl: './student-exam.html',
  styleUrls: ['./student-exam.css']
})
export class StudentExam implements OnInit {

  @Input() examId: string | undefined;
  @Output() closeExams = new EventEmitter<void>();

  private examService = inject(ExamService);

  // --- Signals ---
  currentQuestionIndex = signal<number>(0);
  selectedAnswers = signal<Map<number, number>>(new Map());
  isSubmitted = signal<boolean>(false);
  scorePercentage = signal<number>(0);
  totalCorrect = signal<number>(0);

  // --- Computed ---
  examData = this.examService.examDetails;
  isLoading = this.examService.isLoading;
  errorMessage = this.examService.errorMessage;

  currentQuestion = computed(() => {
    const questions = this.examData()?.questions;
    return questions ? questions[this.currentQuestionIndex()] : null;
  });

  currentSelectedAnswerIndex = computed(() => {
    return this.selectedAnswers().get(this.currentQuestionIndex()) ?? null;
  });

  ngOnInit() {
    if (this.examId) {
      this.loadExamData(this.examId);
    }
  }

  loadExamData(id: string) {
    this.examService.getExamById(id).subscribe({
      next: (data) => {
        // Exam Title வாசிக்க
        setTimeout(() => this.speak("Exam Loaded. " + data.title + ". Press Tab to navigate."), 500);
      },
      error: (err) => console.error("Error loading exam:", err)
    });
  }

  // --- Navigation ---
  nextQuestion() {
    const questions = this.examData()?.questions;
    if (questions && this.currentQuestionIndex() < questions.length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
      this.speak("Next Question");
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(i => i - 1);
      this.speak("Previous Question");
    }
  }

  // --- Selection Logic ---
  selectAnswer(answerIndex: number) {
    if (this.isSubmitted()) return;

    const currentSelected = this.currentSelectedAnswerIndex();

    // ஏற்கனவே Select ஆகியிருந்தால் மீண்டும் சொல்லத் தேவையில்லை, ஆனால் உறுதிப்படுத்தலாம்
    if (currentSelected === answerIndex) {
      this.speak("Answer already selected");
      return;
    }

    // Tick the answer
    this.selectedAnswers.update(map => {
      const newMap = new Map(map);
      newMap.set(this.currentQuestionIndex(), answerIndex);
      return newMap;
    });
    
    // Feedback speech
    const answerText = this.currentQuestion()?.answers[answerIndex];
    this.speak(`Option ${answerIndex + 1} Selected.`);
  }

  // --- Special Logic: Enter Key on Answer ---
  // Enter அல்லது Space அழுத்தினால் Select ஆகும்
  handleKeydown(event: KeyboardEvent, answerIndex: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Page scroll ஆவதை தடுக்க
      this.selectAnswer(answerIndex);
    }
  }

  // --- TTS (Text to Speech) ---
  speak(text: string) {
    if (!text) return;
    window.speechSynthesis.cancel(); // பழைய பேச்சை நிறுத்து
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; 
    utterance.rate = 0.9; // படிக்கும் வேகம்
    window.speechSynthesis.speak(utterance);
  }

  speakCurrentQuestion() {
    const q = this.currentQuestion();
    if (q) this.speak("Question: " + q.question);
  }

  // --- Focus Handler (Tab Navigation) ---
  // Tab அழுத்தி Focus வரும்போது வாசிக்க
  onFocus(text: string | undefined) {
    if (text) {
      this.speak(text);
    }
  }

  // Option-ல் Focus வரும்போது மட்டும் தனியாக வாசிக்க
  onOptionFocus(index: number, answerText: string) {
    const isSelected = this.currentSelectedAnswerIndex() === index;
    let textToRead = `Option ${index + 1}: ${answerText}`;
    if (isSelected) {
      textToRead += ". Selected.";
    }
    this.speak(textToRead);
  }

  // --- Submit ---
  submitExam() {
    const questions = this.examData()?.questions;
    if (!questions) return;

    let correctCount = 0;
    questions.forEach((q, index) => {
      const userAnsIndex = this.selectedAnswers().get(index);
      if (userAnsIndex !== undefined && userAnsIndex === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    this.totalCorrect.set(correctCount);
    const percentage = (correctCount / questions.length) * 100;
    this.scorePercentage.set(Math.round(percentage));
    
    this.isSubmitted.set(true);
    this.speak(`Exam Completed. You scored ${Math.round(percentage)} percent.`);
  }

  goBack() {
    window.speechSynthesis.cancel();
    this.closeExams.emit();
  }
}