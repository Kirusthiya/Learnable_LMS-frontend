import { Component, OnInit, inject } from '@angular/core';
import { TeacherClassService } from '../../../core/services/teacher-class-service';
import { AccountService } from '../../../core/services/accountservices';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../core/services/search-service';
import { RepositoryService } from '../../../core/services/repository-service';
import { AssetsTeacher } from '../assets-teacher/assets-teacher';
import { Search } from "../../search/search";
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-class-teacher',
  imports: [FormsModule, CommonModule, AssetsTeacher, Search],
  templateUrl: './class-teacher.html',
  styleUrls: ['./class-teacher.css']
})
export class ClassTeacher implements OnInit {

  private classService = inject(TeacherClassService);
  private accountService = inject(AccountService);
  public searchService = inject(SearchService);
  private repositoryService = inject(RepositoryService);
  private toast =inject(ToastService);

  public teacherClasses = this.classService.teacherClasses;
  public selectedClassId = this.classService.selectedClassId;
  selectedRepo: any = null;

  public newClassName = '';
  public newClassJoinName = '';
  public newClassDesc = '';
  public showAddModal = false;

  // Repository modal
  public showAddRepoModal = false;
  public newRepoName = '';
  public newRepoDesc = '';
  public newRepoCert = '';

  public showActions = false;     // triple dot dropdown
  public showEditModal = false;   // update modal
  public showDeleteConfirm = false; // delete confirm modal

  public editClassName = '';
  public editClassJoinName = '';
  public editClassDesc = '';

  public currentTeacherId = '';

  ngOnInit(): void {
  const user = this.accountService.currentUser();
  this.currentTeacherId = user?.teacher?.profileId ?? '';

  if (this.currentTeacherId) {
    this.classService.loadClasses(this.currentTeacherId);

    // Auto-select first class (WAIT for signal to populate)
    setTimeout(() => {
      const classes = this.teacherClasses();
      if (classes.length > 0) {
        const firstId = classes[0].classId;
        this.selectClass(firstId);
      }
    }, 300);
  }
}


  selectClass(classId: string) {
    this.searchService.loadClassDetails(classId);
    this.classService.selectClass(classId);
  }

  // --- Class Modal ---
  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.newClassName = '';
    this.newClassJoinName = '';
    this.newClassDesc = '';
  }

  createClass() {
    if (!this.newClassName || !this.newClassJoinName) return;

    this.classService.addClass(
      this.newClassName,
      this.newClassJoinName,
      this.newClassDesc,
      this.currentTeacherId
    );

    this.closeAddModal();
  }

  // --- Repository Modal ---
  openAddRepoModal() {
    this.showAddRepoModal = true;
  }

  closeAddRepoModal() {
    this.showAddRepoModal = false;
    this.newRepoName = '';
    this.newRepoDesc = '';
    this.newRepoCert = '';
  }

createRepo() {
  if (!this.newRepoName) return;

  const classId = this.selectedClassId();
  if (!classId) return;

  // Pass a single object matching RepositoryDto
  this.repositoryService.addRepository({
    classId: classId,
    repoName: this.newRepoName,
    repoDescription: this.newRepoDesc,
    repoCertification: this.newRepoCert
  });

  this.closeAddRepoModal();
}

  openAddStudent() {
    console.log("Add student clicked for class:", this.selectedClassId());
  }

  viewRepository(repo: any) {
    this.selectedRepo = repo; // select repo to pass to app-teacherAssets
  }

  toggleActions() {
  this.showActions = !this.showActions;
}

openEditModal(cls: any) {
  this.editClassName = cls.className;
  this.editClassJoinName = cls.classJoinName;
  this.editClassDesc = cls.description;

  this.showEditModal = true;
  this.showActions = false;
}

saveUpdatedClass() {
  const classId = this.selectedClassId();
  if (!classId) return;

  const dto = {
    classId: classId,
    className: this.editClassName,
    classJoinName: this.editClassJoinName,
    description: this.editClassDesc,
    teacherId: this.currentTeacherId,
    status: "Active"
  };

  this.classService.updateClass(classId, dto, this.currentTeacherId)
    .subscribe({
      next: () => {
        this.showEditModal = false;
        this.classService.loadClasses(this.currentTeacherId);
        this.toast.success('update class');

        // redirect home (dashboard)
        window.location.href = "/dashboad";
      },
      error: (err) => console.error(err)
      
    });
}

openDeleteConfirm() {
  this.showDeleteConfirm = true;
  this.showActions = false;
}

confirmDeleteClass() {
  const classId = this.selectedClassId();
  if (!classId) return;

  this.classService.deleteClass(classId)
    .subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.classService.loadClasses(this.currentTeacherId);
        this.toast.success('Class Delete');


        // redirect to Home
        window.location.href = "/dashboad";
      },
      error: (err) => console.error(err)
    });
}

closeEditModal() {
  this.showEditModal = false;
}

closeDeleteModal() {
  this.showDeleteConfirm = false;
}


}
