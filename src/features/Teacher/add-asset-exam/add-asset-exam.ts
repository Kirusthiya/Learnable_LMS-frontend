import { Component, ChangeDetectorRef, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Import Services
import { TeacherAssetService } from '../../../core/services/teacher-asset-services';
import { ExamService } from '../../../core/services/teacher-exam-service'; 

// Import Types
import { AddAssetRequest, OcrPdfDto, AssetDto } from '../../../types/asset-types';
import { RepositoryDetail } from '../../../types/repo-types';
import { GetQuestionQuery, ExamQuestionDto, CreateExamDto, ExamDto } from '../../../types/exam-types'; 

// Local Interface
interface LocalExamQuestion extends ExamQuestionDto {
  selected?: boolean;
}

@Component({
  selector: 'app-add-asset-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-asset-exam.html',
  styleUrl: './add-asset-exam.css',
})
export class AddAssetExam implements OnInit, OnChanges {
  
  @Input() repository: RepositoryDetail | any; 
  @Output() close = new EventEmitter<void>();

  activeTab: 'pdf' | 'exam' = 'pdf'; 
  
  // PDF / OCR Variables
  extractedChunks: string[] = []; 
  isLoading: boolean = false;
  progressStatus: string = '';
  showDetailsForm: boolean = false; 
  assetTitle: string = '';
  assetUrl: string = '';
  assetDescription: string = '';
  isSaving: boolean = false;

  // AI Exam Variables
  generatedQuestions: LocalExamQuestion[] = []; 
  isGeneratingQuestions: boolean = false;
  isSavingExam: boolean = false;
  examTitle: string = 'Generated Exam'; 
  
  // Configuration
  selectedAssetIds: Set<string> = new Set<string>(); 
  questionCount: number = 5; 

  // UI Variables
  isAllSelected: boolean = true;
  showManualAddForm: boolean = false;
  
  // Updated for 5 answers
  newQuestion: LocalExamQuestion = {
    question: '',
    answers: ['', '', '', '', ''], 
    correctAnswerIndex: 0,
    selected: true,
    examId: '',     
    questionId: ''  
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private assetService: TeacherAssetService,
    private examService: ExamService 
  ) {
    this.setupPdfWorker(); 
  }

  get selectedCount(): number {
    return this.generatedQuestions.filter(q => q.selected).length;
  }

  ngOnInit() {
    if (this.repository) {
      this.examTitle = `Exam for ${this.repository.repoName || 'Repo'}`;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['repository'] && this.repository) {
       this.examTitle = `Exam for ${this.repository.repoName || 'Repo'}`;
    }
  }

  setActiveTab(tab: 'pdf' | 'exam') {
    this.activeTab = tab;
  }

  // --- CLEANUP & RESET ---
  clearData() {
    this.extractedChunks = [];
    this.progressStatus = '';
    this.isLoading = false;
    this.showDetailsForm = false; 
    this.resetForm();
    this.resetExam(); 
  }

  resetForm() {
    this.assetTitle = '';
    this.assetUrl = '';
    this.assetDescription = '';
  }

  resetExam() {
    this.generatedQuestions = [];
    this.isGeneratingQuestions = false;
    this.showManualAddForm = false;
    this.isAllSelected = true;
  }

  goToFormView() {
    if (this.extractedChunks.length === 0) {
      alert("No content extracted!");
      return;
    }
    this.showDetailsForm = true; 
  }

  backToList() {
    this.showDetailsForm = false;
  }

  // --- 1. ASSET SELECTION LOGIC ---

  toggleAssetSelection(assetId: string) {
    if (!assetId) return;
    
    if (this.selectedAssetIds.has(assetId)) {
      this.selectedAssetIds.delete(assetId);
    } else {
      this.selectedAssetIds.add(assetId);
    }
  }

  // --- 2. GENERATE AI QUESTIONS ---

  generateManualExam() {
    if (this.selectedAssetIds.size === 0) {
      alert("Please select at least one asset to generate questions.");
      return;
    }
    if (this.questionCount < 1 || this.questionCount > 50) {
      alert("Question count must be between 1 and 50.");
      return;
    }

    const assetIdList = Array.from(this.selectedAssetIds);
    this.generateAiQuestions(assetIdList, this.questionCount);
  }

  generateAiQuestions(assetIds: string[], count: number = 5) {
    this.isGeneratingQuestions = true;
    if(this.activeTab !== 'exam') this.setActiveTab('exam'); 

    const query: GetQuestionQuery = {
      asset_Id: assetIds,   
      question_Count: count
    };

    console.log("Sending AI Query:", query);

    this.examService.getAiQuestions(query).subscribe({
      next: (questions: ExamQuestionDto[]) => {
        console.log("Questions Generated:", questions);
        
        const newQuestions: LocalExamQuestion[] = questions.map(q => ({
          ...q,
          selected: true,
          answers: q.answers.length < 5 
            ? [...q.answers, ...Array(5 - q.answers.length).fill('')] 
            : q.answers
        }));
        
        this.generatedQuestions = [...this.generatedQuestions, ...newQuestions];
        
        this.isAllSelected = true;
        this.isGeneratingQuestions = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error("AI Generation Failed:", err);
        this.isGeneratingQuestions = false;
        this.cdr.detectChanges();
        alert("Failed to generate AI questions. Check console for details.");
      }
    });
  }

  // --- 3. QUESTION LIST MANAGEMENT ---

  toggleSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    this.generatedQuestions.forEach(q => q.selected = this.isAllSelected);
  }

  updateSelectAllState() {
    this.isAllSelected = this.generatedQuestions.length > 0 && this.generatedQuestions.every(q => q.selected);
  }

  deleteQuestion(index: number) {
    if(confirm('Remove this question from the list?')) {
      this.generatedQuestions.splice(index, 1);
      this.updateSelectAllState();
    }
  }

  toggleManualAddForm() {
    this.showManualAddForm = !this.showManualAddForm;
    this.newQuestion = {
      question: '',
      answers: ['', '', '', '', ''], 
      correctAnswerIndex: 0,
      selected: true,
      examId: '',
      questionId: ''
    };
  }

  saveManualQuestion() {
    if (!this.newQuestion.question?.trim()) {
      alert("Please enter a question.");
      return;
    }
    const filledAnswers = this.newQuestion.answers.filter(a => a?.trim());
    if (filledAnswers.length < 2) {
      alert("Please provide at least 2 answer options.");
      return;
    }

    this.generatedQuestions.unshift(JSON.parse(JSON.stringify(this.newQuestion)));
    this.showManualAddForm = false;
    this.updateSelectAllState();
  }

  // --- 4. CREATE EXAM (FIXED & UPDATED) ---

  createFinalExam() {
    // 1. Filter only selected questions
    const finalQuestions = this.generatedQuestions.filter(q => q.selected);

    if (finalQuestions.length === 0) {
      alert("No questions selected to save.");
      return;
    }

    // 2. Validate Repo ID
    if (!this.repository || !this.repository.repoId) {
        alert("Repository ID is missing. Cannot create exam.");
        console.error("Repo ID missing in object:", this.repository);
        return;
    }

    this.isSavingExam = true;

    // 3. Prepare DTO with Index Logic Fix
    const questionsPayload = finalQuestions.map(q => {
        const originalAnswerText = q.answers[q.correctAnswerIndex];
        const cleanAnswers = q.answers.filter(ans => ans && ans.trim().length > 0);
        let newCorrectIndex = cleanAnswers.indexOf(originalAnswerText);
        if (newCorrectIndex === -1) newCorrectIndex = 0;

        return {
           question: q.question.trim(),
           answers: cleanAnswers,
           correctAnswerIndex: newCorrectIndex
        };
    });

    const examData: CreateExamDto = {
        title: this.examTitle || 'Untitled Exam',
        repoId: this.repository.repoId,
        
        // 👇 UPDATE: Using 'Question' to match updated Type and Backend
        Question: questionsPayload 
    };

    console.log("🚀 Payload being sent to Backend:", JSON.stringify(examData, null, 2));

    this.examService.createExam(examData).subscribe({
        next: (res: ExamDto) => {
            console.log("Exam Created Successfully:", res);
            this.isSavingExam = false;
            
            if (res.questions && res.questions.length > 0) {
                this.generatedQuestions = res.questions.map((q: ExamQuestionDto) => ({
                    ...q,
                    selected: true,
                     answers: q.answers.length < 5 
                     ? [...q.answers, ...Array(5 - q.answers.length).fill('')] 
                     : q.answers
                }));
            }
            
            alert("Exam Created Successfully!");
            this.close.emit(); 
        },
        error: (err) => {
            console.error("Failed to create exam. Backend Error:", err);
            this.isSavingExam = false;
            const errorMsg = err.error?.message || err.message || 'Please check console';
            alert(`Error creating exam: ${errorMsg}`);
        }
    });
  }

  // --- 5. SAVE ASSET LOGIC ---

  finalSaveAsset() {
    const currentRepoId = this.repository?.repoId;

    if (!currentRepoId) {
      alert("Error: Repository ID is missing inside the data. Cannot save.");
      return;
    }

    if (!this.assetTitle) {
      alert("Please enter an Asset Title.");
      return;
    }

    this.isSaving = true;

    const ocrList: OcrPdfDto[] = this.extractedChunks.map((text, index) => ({
      chunkId: index + 1,
      chunk: text
    }));

    const requestData: AddAssetRequest = {
      title: this.assetTitle,
      type: 'PDF',
      url: this.assetUrl || 'Uploaded File',
      description: this.assetDescription,
      repoId: currentRepoId,
      ocrPdfs: ocrList
    };

    this.assetService.addAsset(requestData, currentRepoId).subscribe({
      next: (res: AssetDto) => {
        console.log("Success:", res);
        this.isSaving = false;
        alert("Asset Saved Successfully!");
        
        const newAssetId = res.assetId || res.id; 

        if(newAssetId && confirm("Do you want to generate AI Questions for this asset now?")) {
           this.selectedAssetIds.clear();
           this.selectedAssetIds.add(newAssetId); 
           this.setActiveTab('exam');
           this.generateAiQuestions([newAssetId], 5); 
        } else {
           this.close.emit();
        }
      },
      error: (err: any) => {
        console.error("Error:", err);
        this.isSaving = false;
        alert("Failed to save asset.");
      }
    });
  }

  // --- PDF & OCR LOGIC ---

  setupPdfWorker() {
    const version = pdfjsLib.version || '3.11.174';
    let workerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
    if (version.startsWith('4.') || version.startsWith('5.')) {
        workerUrl = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
    }
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.isLoading = true;
      this.progressStatus = 'Initializing...';
      this.extractedChunks = [];
      this.showDetailsForm = false; 
      this.cdr.detectChanges(); 
      try {
        this.assetUrl = file.name; 
        await this.processPdf(file); 
      } catch (error: any) {
        console.error('Error:', error);
        this.progressStatus = 'Error Occurred during scanning!';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } else {
      alert('Please upload a valid PDF file.');
    }
    event.target.value = ''; 
  }

  async processPdf(file: File) {
    const arrayBuffer = await file.arrayBuffer(); 
    this.progressStatus = 'Loading PDF Document...';
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    this.progressStatus = `Found ${pdf.numPages} pages. Starting OCR...`;
    this.cdr.detectChanges();
    let fullText = ''; 
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      this.progressStatus = `Scanning Page ${pageNum} of ${pdf.numPages}...`;
      this.cdr.detectChanges();
      const page = await pdf.getPage(pageNum);
      const canvas = await this.renderPageToCanvas(page); 
      const text = await this.performOcr(canvas); 
      fullText += text + " "; 
    }
    this.chunkText(fullText);
    this.isLoading = false;
    this.progressStatus = 'Scanning Complete!';
    this.cdr.detectChanges();
  }

  chunkText(text: string) {
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const words = cleanText.split(' '); 
    const chunkSize = 30;
    this.extractedChunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk.length > 0) {
        this.extractedChunks.push(chunk); 
      }
    }
  }

  async renderPageToCanvas(page: any): Promise<HTMLCanvasElement> {
    const scale = 1.5; 
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context!, viewport }).promise;
    return canvas;
  }

  async performOcr(canvas: HTMLCanvasElement): Promise<string> {
    try {
      const result = await Tesseract.recognize(canvas, 'eng', { logger: () => {} });
      return result.data.text;
    } catch (err) {
      console.error("OCR Error:", err);
      return ''; 
    }
  }
}