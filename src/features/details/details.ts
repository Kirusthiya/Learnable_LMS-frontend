import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../core/services/search-service';
import { RequestService } from '../../core/services/request-service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../core/services/accountservices';

@Component({
  selector: 'app-details',
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
  imports: [CommonModule],
})
export class Details implements OnInit {
  private searchService = inject(SearchService);
  private requestService = inject(RequestService);
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);

  entityType!: 'Class' | 'User';
  entityId!: string;

  classDetails = this.searchService.classDetails;
  userDetails = this.searchService.userDetails;
  joinLoading = this.searchService.joinClassLoading;
  joinMessage = this.searchService.joinClassMessage;

  ngOnInit(): void {
    this.entityId = this.route.snapshot.paramMap.get('id')!;
    this.entityType = (this.route.snapshot.queryParamMap.get('type') as 'User' | 'Class') || 'Class';

    if (this.entityType === 'Class') {
      this.searchService.loadClassDetails(this.entityId);
    } else {
      this.searchService.loadUserDetails(this.entityId);
    }
  }

  // Check if current user already joined the class
  alreadyJoined(): boolean {
    const user = this.accountService.currentUser();
    const classInfo = this.classDetails();
    if (!user || !classInfo) return false;

    return classInfo.students?.some(s => s.userId === user.user.id) || false;
  }
  

  handleJoinClass(): void {
    const currentUser = this.accountService.currentUser();
    const classInfo = this.classDetails();
    if (!currentUser || !classInfo) return;

    if (this.alreadyJoined()) {
      this.joinMessage.set('You are already enrolled in this class.');
      return;
    }

    // Wrap payload in RequestDto as backend expects
  const payload = {
    RequestDto: {
      SenderId: currentUser.user.id,
      ReceiverId: classInfo.teacher.userId,
      ClassId: classInfo.classId,
      NotificationStatus: 'Pending'
    }
};
    this.joinLoading.set(true);
    this.requestService.sendJoinRequest(payload).subscribe({
      next: () => {
        this.joinLoading.set(false);
        this.joinMessage.set('Join request sent successfully.');
      },
      error: (err) => {
        console.error('Join class request failed', err);
        this.joinLoading.set(false);
        this.joinMessage.set('Failed to send join request.');
      }
    });
  }
}
