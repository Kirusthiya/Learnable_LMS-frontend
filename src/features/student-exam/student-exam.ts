import { Component, EventEmitter, Input, Output, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../core/services/teacher-exam-service';
import { MarksService } from '../../core/services/marks-service'; // ⭐ Ensure this path matches your folder structure
import { KeyboardNav } from "../../core/directives/accessibility/keyboard-nav";
import { MarksDto, StudentAnswerDto } from '../../types/marks.types'; 
import { AccountService } from '../../core/services/accountservices';

@Component({
  selector: 'app-student-exam',
  standalone: true,
  imports: [CommonModule, KeyboardNav],
  templateUrl: './student-exam.html',
  styleUrls: ['./student-exam.css']
})
export class StudentExam implements OnInit {

  @Input() examId: string | undefined;
  
  // This will now be overwritten by the AccountService logic in ngOnInit
  @Input() studentId: string = ''; 
  
  @Output() closeExams = new EventEmitter<void>();

  private examService = inject(ExamService);
  private marksService = inject(MarksService);
  private accountService = inject(AccountService); // ⭐ NEW: Inject AccountService

  // --- Signals ---
  currentQuestionIndex = signal<number>(0);
  selectedAnswers = signal<Map<number, number>>(new Map());
  isSubmitted = signal<boolean>(false);
  scorePercentage = signal<number>(0);
  totalCorrect = signal<number>(0);
  isSubmitting = signal<boolean>(false);

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
    // ⭐ NEW: Logic to get studentId from logged-in user (Browser/LocalStorage)
    const currentUser = this.accountService.currentUser();
    
    if (currentUser) {
        // Prioritize student.userId, fallback to user.userId
        this.studentId = currentUser.student?.userId || currentUser.user.userId;
        console.log("Student ID set from AccountService:", this.studentId);
    } else {
        console.error("No logged-in user found in AccountService!");
    }

    if (this.examId) {
      this.loadExamData(this.examId);
    } else {
      console.error("No Exam ID provided to StudentExam component");
    }
  }

  loadExamData(id: string) {
    this.examService.getExamById(id).subscribe({
      next: (data) => {
        // Accessibility announcement
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

    if (currentSelected === answerIndex) {
      this.speak("Answer already selected");
      return;
    }

    this.selectedAnswers.update(map => {
      const newMap = new Map(map);
      newMap.set(this.currentQuestionIndex(), answerIndex);
      return newMap;
    });
    
    this.speak(`Option ${answerIndex + 1} Selected.`);
  }

  handleKeydown(event: KeyboardEvent, answerIndex: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectAnswer(answerIndex);
    }
  }

  // --- TTS (Text to Speech) ---
  speak(text: string) {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; 
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  speakCurrentQuestion() {
    const q = this.currentQuestion();
    if (q) this.speak("Question: " + q.question);
  }

  onFocus(text: string | undefined) {
    if (text) {
      this.speak(text);
    }
  }

  onOptionFocus(index: number, answerText: string) {
    const isSelected = this.currentSelectedAnswerIndex() === index;
    let textToRead = `Option ${index + 1}: ${answerText}`;
    if (isSelected) {
      textToRead += ". Selected.";
    }
    this.speak(textToRead);
  }

  // --- Submit Logic ---
  submitExam() {
    // 1. Validation
    const questions = this.examData()?.questions;
    const eId = this.examId;
    const sId = this.studentId; 

    if (!questions || questions.length === 0) {
        console.error("No questions found.");
        this.speak("Error. No questions found.");
        return;
    }

    if (!eId) {
        console.error("Missing Exam ID.");
        return;
    }

    // Guard against invalid ID
    if (!sId || sId === 'current-student-id' || sId === '') {
        console.error("Missing Valid Student ID. Cannot submit.");
        alert("System Error: User not identified. Please refresh or log in again.");
        return;
    }

    // 2. Calculate Score & Prepare Answers
    let correctCount = 0;
    const studentAnswersList: StudentAnswerDto[] = [];

    questions.forEach((q, index) => {
      const userAnsIndex = this.selectedAnswers().get(index);
      
      // Calculate Local Score
      if (userAnsIndex !== undefined && userAnsIndex === q.correctAnswerIndex) {
        correctCount++;
      }

      // Add to payload if answered
      if (userAnsIndex !== undefined && q.questionId) {
          studentAnswersList.push({
              questionId: q.questionId, 
              answerIndex: userAnsIndex,
              submittedAt: new Date().toISOString()
          });
      }
    });

    // 3. Final Calculations
    const percentage = (correctCount / questions.length) * 100;
    const finalScore = Math.round(percentage);

    // 4. Create DTO
    const marksDto: MarksDto = {
        examId: eId,
        studentId: sId,
        marks: finalScore, 
        examStatus: 'Completed',
        studentsAnswers: studentAnswersList
    };

    // 5. Submit to Backend
    this.isSubmitting.set(true);
    this.speak("Submitting your exam, please wait.");

    this.marksService.updateMark(marksDto).subscribe({
        next: (updatedMark) => {
            // Success
            this.totalCorrect.set(correctCount);
            this.scorePercentage.set(finalScore);
            this.isSubmitted.set(true);
            this.isSubmitting.set(false);
            
            this.speak(`Exam Submitted Successfully. You scored ${finalScore} percent.`);
        },
        error: (err) => {
            console.error('Error submitting marks:', err);
            this.isSubmitting.set(false);
            this.speak("There was an error submitting your exam. Please try again.");
            alert("Failed to submit exam. Check console for details.");
        }
    });
  }

  goBack() {
    window.speechSynthesis.cancel();
    this.closeExams.emit();
  }
}