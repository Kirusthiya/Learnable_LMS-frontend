import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../core/services/accountservices';
import { Class } from '../../../types/user';
import { Repository } from "../../repository/repository";
import { Assets } from '../../assets/assets';
import { KeyboardNav } from '../../../core/directives/accessibility/keyboard-nav';
import { Speak } from "../../../core/directives/accessibility/speak";
import { Search } from '../../search/search';

@Component({
    selector: 'app-dashboard-home',
    standalone: true,
    imports: [CommonModule, Repository, Assets, KeyboardNav, Speak, Search],
    templateUrl: './dashboard-home.html',
})
export class DashboardHome {
    private accountService = inject(AccountService);

    selectedClassId = signal<string | null>(null);
    selectedRepositoryId = signal<string | null>(null);

    studentClasses = computed<Class[]>(() => {
        const user = this.accountService.currentUser();
        return user?.student?.classes || [];
    });

    // When class is clicked
    viewClass(id: string) {
        this.selectedClassId.set(id);
    }

    // Repository clicked
    openRepository(repoId: string) {
        this.selectedRepositoryId.set(repoId);
    }

    // Back from assets → go to repository list
    backFromAssets() {
        this.selectedRepositoryId.set(null);
    }

    // Back from repositories → go to class list
    backToDashboard() {
        this.selectedClassId.set(null);
    }
}
