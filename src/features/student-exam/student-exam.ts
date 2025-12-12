import { Component, EventEmitter, Input, Output, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../core/services/teacher-exam-service';
import { KeyboardNav } from "../../core/directives/accessibility/keyboard-nav"; // Path may vary based on your project

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
        // Exam load ஆனதும் Title-ஐ வாசிக்கலாம்
        setTimeout(() => this.speak("Exam Loaded. " + data.title), 500);
      },
      error: (err) => console.error("Error loading exam:", err)
    });
  }

  // --- Navigation ---
  nextQuestion() {
    const questions = this.examData()?.questions;
    if (questions && this.currentQuestionIndex() < questions.length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
      // அடுத்த கேள்வி வந்ததும் அதை தானாக வாசிக்க (Optional)
      // setTimeout(() => this.speakCurrentQuestion(), 500);
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(i => i - 1);
    }
  }

  // --- Selection Logic ---
  selectAnswer(answerIndex: number) {
    if (this.isSubmitted()) return;

    // Tick the answer
    this.selectedAnswers.update(map => {
      const newMap = new Map(map);
      newMap.set(this.currentQuestionIndex(), answerIndex);
      return newMap;
    });
    
    // Feedback speech
    this.speak("Answer Selected");
  }

  // --- Special Logic: Enter Key on Answer ---
  // 1. First Enter: Selects the answer.
  // 2. Second Enter (if already selected): Moves to Next Question.
  handleAnswerEnter(answerIndex: number) {
    const currentSelected = this.currentSelectedAnswerIndex();

    if (currentSelected === answerIndex) {
      // ஏற்கனவே Select ஆகியிருந்தால் -> Next Question
      this.speak("Moving to next question");
      this.nextQuestion();
    } else {
      // Select ஆகவில்லை என்றால் -> Select பண்ணு
      this.selectAnswer(answerIndex);
    }
  }

  // --- TTS (Text to Speech) ---
  speak(text: string) {
    window.speechSynthesis.cancel(); // Stop previous sound
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; 
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  speakCurrentQuestion() {
    const q = this.currentQuestion();
    if (q) this.speak(q.question);
  }

  // --- Focus Handler ---
  // Tab அழுத்தி வரும்போது வாசிப்பதற்காக
  onFocus(text: string | undefined) {
    if (text) {
      this.speak(text);
    }
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