import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';
import { MarksDto, AddMarkCommand, CreateMarkResponse } from '../../types/marks.types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarksService {
  private http = inject(HttpClient);

  // 👇 FIX: Environment URL la irukka koodiya trailing slash ('/') ah remove pandrom.
  // Ippadi panninal '.../api//marks' endru varathu, correct ah '.../api/marks' nu varum.
  private apiUrl = `${environment.apiUrl.replace(/\/+$/, '')}/marks`; 

  // ==========================================
  // 👇 SIGNALS FOR STATE MANAGEMENT
  // ==========================================
  
  // Stores the list of marks for a specific exam
  private marksListSignal = signal<MarksDto[]>([]);
  public marksList = this.marksListSignal.asReadonly(); // Expose as ReadOnly

  // Stores the currently selected single mark details
  private currentMarkSignal = signal<MarksDto | null>(null);
  public currentMark = this.currentMarkSignal.asReadonly();

  // Loading state
  private loadingSignal = signal<boolean>(false);
  public loading = this.loadingSignal.asReadonly();

  // Error state
  private errorSignal = signal<string | null>(null);
  public error = this.errorSignal.asReadonly();

  // ==========================================
  // 👇 API METHODS
  // ==========================================

  /**
   * 1️⃣ Get Mark by ExamId + StudentId
   * Updates 'currentMark' signal
   */
  getMark(examId: string, studentId: string): Observable<MarksDto> {
    this.loadingSignal.set(true);
    return this.http.get<MarksDto>(`${this.apiUrl}/${examId}/${studentId}`).pipe(
      tap((mark) => {
        this.currentMarkSignal.set(mark);
        this.errorSignal.set(null);
      }),
      catchError((err) => this.handleError(err)),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  /**
   * 2️⃣ Get Marks by ExamId (List)
   * Updates 'marksList' signal
   */
  getMarksByExam(examId: string): Observable<MarksDto[]> {
    this.loadingSignal.set(true);
    //  - Conceptual check: URL is now clean
    return this.http.get<MarksDto[]>(`${this.apiUrl}/exam/${examId}`).pipe(
      tap((marks) => {
        this.marksListSignal.set(marks);
        this.errorSignal.set(null);
      }),
      catchError((err) => this.handleError(err)),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  /**
   * 3️⃣ Update Mark
   * Optimistically updates the 'marksList' signal so UI updates instantly
   */
  updateMark(markDto: MarksDto): Observable<MarksDto> {
    this.loadingSignal.set(true);
    return this.http.put<MarksDto>(`${this.apiUrl}`, markDto).pipe(
      tap((updatedMark) => {
        // Update the list signal locally without refreshing data
        this.marksListSignal.update((currentMarks) => 
          currentMarks.map(m => 
            (m.studentId === updatedMark.studentId && m.examId === updatedMark.examId) 
            ? updatedMark 
            : m
          )
        );
        
        // Also update current mark if it's the one selected
        if (this.currentMarkSignal()?.studentId === updatedMark.studentId) {
          this.currentMarkSignal.set(updatedMark);
        }
      }),
      catchError((err) => this.handleError(err)),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  /**
   * 4️⃣ Delete Mark
   * Removes the deleted mark from the 'marksList' signal locally
   */
  deleteMark(examId: string, studentId: string): Observable<void> {
    this.loadingSignal.set(true);
    return this.http.delete<void>(`${this.apiUrl}/${examId}/${studentId}`).pipe(
      tap(() => {
        // Remove from signal list locally
        this.marksListSignal.update((marks) => 
          marks.filter(m => !(m.examId === examId && m.studentId === studentId))
        );
        this.currentMarkSignal.set(null);
      }),
      catchError((err) => this.handleError(err)),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  /**
   * 5️⃣ Create Default Marks (POST)
   * Returns success message and IDs
   */
  createDefaultMarks(command: AddMarkCommand): Observable<CreateMarkResponse> {
    this.loadingSignal.set(true);
    return this.http.post<CreateMarkResponse>(`${this.apiUrl}/create-default`, command).pipe(
      tap(() => {
        // Optionally fetch the new list immediately after creation
        // this.getMarksByExam(command.examId).subscribe();
      }),
      catchError((err) => this.handleError(err)),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  // Helper for error handling
  private handleError(error: any) {
    console.error('API Error:', error);
    const errorMessage = error.error?.message || 'An unexpected error occurred';
    this.errorSignal.set(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}