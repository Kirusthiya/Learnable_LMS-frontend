import { Component, computed, inject, signal, WritableSignal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../core/services/accountservices';
import { Class, UserResponse } from '../../../types/user';
import { Repository } from "../../repository/repository";
import { Assets } from '../../assets/assets';
import { KeyboardNav } from '../../../core/directives/accessibility/keyboard-nav';
import { Speak } from "../../../core/directives/accessibility/speak";
import { Search } from '../../search/search';
import { ClassTeacher } from "../../Teacher/class-teacher/class-teacher";
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-dashboard-home',
    standalone: true,
    imports: [CommonModule, Repository, Assets, KeyboardNav, Search, ClassTeacher, FormsModule],
    templateUrl: './dashboard-home.html',
})
export class DashboardHome implements OnInit, OnDestroy {
    public accountService = inject(AccountService);

    dataLoading = signal(true); 

    selectedClassId = signal<string | null>(null);
    selectedRepositoryId = signal<string | null>(null);
    userRole = computed(() => this.accountService.currentUser()?.user.role);
    
    isSidebarOpen: WritableSignal<boolean> = signal(false);
    isNavOverlayActive = signal(false);

    private subscription: Subscription = new Subscription(); 

    studentClasses = computed<Class[]>(() => {
        const user = this.accountService.currentUser();
        if (!this.dataLoading()) {
            return user?.student?.classes || [];
        }
        return [];
    });

    ngOnInit(): void {
        this.loadInitialUserData();
    }
    
    private loadInitialUserData(): void {
        this.dataLoading.set(true);

        const currentUser: UserResponse | null = this.accountService.currentUser();
        const userId = currentUser?.user?.userId || currentUser?.id; 

        if (userId) {
            this.subscription.add(
                this.accountService.getUserById(userId).subscribe({
                    next: (userResponse) => {
                        console.log('User Data fetched from DB for Dashboard:', userResponse);
                        this.dataLoading.set(false); 
                        // Voice Feedback on Load
                        setTimeout(() => this.speak("Dashboard Loaded. Welcome back."), 500);
                    },
                    error: (err) => {
                        console.error('Failed to load user data from DB:', err);
                        this.dataLoading.set(false);
                    }
                })
            );
        } else {
            console.warn('User ID not found, unable to load data .');
            this.dataLoading.set(false);
        }
    }
    
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    viewClass(id: string) {
        this.speak("Opening Class Details");
        this.selectedClassId.set(id);
        this.isSidebarOpen.set(false);
    }

    openRepository(repoId: string) {
        this.speak("Opening Repository");
        this.selectedRepositoryId.set(repoId);
    }

    backFromAssets() {
        this.speak("Returning to Repository List");
        this.selectedRepositoryId.set(null);
    }

    backToDashboard() {
        this.speak("Returning to Dashboard Class History");
        this.selectedClassId.set(null);
    }

    // --- TTS (Text to Speech) Implementation ---
    
    speak(text: string) {
        window.speechSynthesis.cancel(); // Stop previous sound
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; 
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }

    onFocus(text: string | undefined) {
        if (text) {
          this.speak(text);
        }
    }

}