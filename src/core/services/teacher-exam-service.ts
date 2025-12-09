import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { 
  CreateExamCommand, 
  CreateExamDto, 
  UpdateExamCommand, 
  UpdateExamDto, 
  ExamQuestionDto, 
  ExamDto,
  GetQuestionQuery 
} from '../../types/exam-types';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}Exam`; 

  // --- SIGNALS (State) ---
  private _examDetails = signal<ExamDto | null>(null);
  public examDetails = this._examDetails.asReadonly();

  private _aiQuestions = signal<ExamQuestionDto[]>([]);
  public aiQuestions = this._aiQuestions.asReadonly();

  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  constructor() { }

  // --- API METHODS ---

  /**
   * Create Exam
   * POST /api/Exam/create
   * Note: Wrapper logic is KEPT because Backend expects CreateExamCommand
   */
  createExam(examData: CreateExamDto): Observable<ExamDto> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload: CreateExamCommand = { exam: examData };

    return this.http.post<ExamDto>(`${this.apiUrl}/create`, payload).pipe(
      tap((response) => {
        this._examDetails.set(response);
        this.isLoading.set(false);
      }),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Update Exam
   * PUT /api/Exam/
   */
  updateExam(updateData: UpdateExamDto): Observable<ExamDto> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    const payload: UpdateExamCommand = { exam: updateData };

    return this.http.put<ExamDto>(`${this.apiUrl}/`, payload).pipe(
      tap((response) => {
        this._examDetails.set(response);
        this.isLoading.set(false);
      }),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Get Exam By ID
   * GET /api/Exam/{id}
   */
  getExamById(id: string): Observable<ExamDto> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    return this.http.get<ExamDto>(`${this.apiUrl}/${id}`).pipe(
      tap((response) => {
        this._examDetails.set(response);
        this.isLoading.set(false);
      }),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Delete Exam
   * DELETE /api/Exam/{id}
   */
  deleteExam(id: string): Observable<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._examDetails.set(null); 
        this.isLoading.set(false);
      }),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Get AI Questions
   * POST /api/Exam/get-questions
   */
  getAiQuestions(query: GetQuestionQuery): Observable<ExamQuestionDto[]> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    return this.http.post<ExamQuestionDto[]>(`${this.apiUrl}/get-questions`, query).pipe(
      tap((response) => {
        this._aiQuestions.set(response);
        this.isLoading.set(false);
        console.log("AI Questions Loaded:", response);
      }),
      catchError((err) => this.handleError(err))
    );
  }

  // --- ERROR HANDLER ---
  private handleError(error: HttpErrorResponse) {
    this.isLoading.set(false);
    
    let errorMsg = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Error: ${error.error.message}`;
    } else {
      errorMsg = error.error?.message || error.error || `Error Code: ${error.status}`;
    }

    this.errorMessage.set(errorMsg);
    console.error(errorMsg);
    return throwError(() => new Error(errorMsg));
  }
}