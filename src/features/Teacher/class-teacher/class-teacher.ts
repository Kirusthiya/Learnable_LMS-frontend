import { Component, OnInit, inject } from '@angular/core';
import { TeacherClassService } from '../../../core/services/teacher-class-service';
import { AccountService } from '../../../core/services/accountservices';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../core/services/search-service';
import { RepositoryService } from '../../../core/services/repository-service';
import { AssetsTeacher } from '../assets-teacher/assets-teacher';

@Component({
  selector: 'app-class-teacher',
  imports: [FormsModule, CommonModule, AssetsTeacher],
  templateUrl: './class-teacher.html',
  styleUrls: ['./class-teacher.css']
})
export class ClassTeacher implements OnInit {

  private classService = inject(TeacherClassService);
  private accountService = inject(AccountService);
  public searchService = inject(SearchService);
  private repositoryService = inject(RepositoryService);

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

  public currentTeacherId = '';

  ngOnInit(): void {
    const user = this.accountService.currentUser();
    this.currentTeacherId = user?.teacher?.profileId ?? '';

    // Load teacher classes
    if (this.currentTeacherId) {
      this.classService.loadClasses(this.currentTeacherId);
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

}
