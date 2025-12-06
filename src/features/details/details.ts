// import { Component, inject, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { SearchService } from '../../core/services/search-service';
// import { RequestService } from '../../core/services/request-service';
// import { CommonModule } from '@angular/common';
// import { AccountService } from '../../core/services/accountservices';

// @Component({
//   selector: 'app-details',
//   templateUrl: './details.html',
//   styleUrls: ['./details.css'],
//   imports: [CommonModule],
// })
// export class Details implements OnInit {
//   private searchService = inject(SearchService);
//   private requestService = inject(RequestService);
//   private accountService = inject(AccountService);
//   private route = inject(ActivatedRoute);

//   entityType!: 'Class' | 'User';
//   entityId!: string;

//   classDetails = this.searchService.classDetails;
//   userDetails = this.searchService.userDetails;
//   joinLoading = this.searchService.joinClassLoading;
//   joinMessage = this.searchService.joinClassMessage;

//   ngOnInit(): void {
//     this.entityId = this.route.snapshot.paramMap.get('id')!;
//     this.entityType = (this.route.snapshot.queryParamMap.get('type') as 'User' | 'Class') || 'Class';

//     if (this.entityType === 'Class') {
//       this.searchService.loadClassDetails(this.entityId);
//     } else {
//       this.searchService.loadUserDetails(this.entityId);
//     }
//   }


//   alreadyJoined(): boolean {
//    const user = this.accountService.currentUser();
//    const classInfo = this.classDetails();
//    if (!user || !classInfo) return false;


//   return classInfo.students?.some(s => s.userId === user.user.userId) || false;
//   }
//   handleJoinClass(): void {
//   const currentUser = this.accountService.currentUser();
//   const classInfo = this.classDetails();
//    if (!currentUser || !classInfo) return;


//   const senderId = currentUser.user?.userId; 

//   if (!senderId) {
//    console.error('Error: Current user ID (SenderId) is missing in the session data.');
//     this.joinMessage.set('Failed to send request: User ID not found.');
//   return; 
//    }

//  const payload = {
//      RequestDto: {
//      SenderId: senderId, 
//      ReceiverId: classInfo.teacher.userId,
//      ClassId: classInfo.classId,
//      NotificationStatus: 'Pending'
//    }
//  };

  
// console.log('Payload being sent:', payload);

// this.joinLoading.set(true);

//     this.requestService.sendJoinRequest(payload).subscribe({
//       next: () => {
//         this.joinLoading.set(false);
//         this.joinMessage.set('Join request sent successfully.');
//       },
//       error: (err) => {
//         console.error('Join class request failed', err);
//         this.joinLoading.set(false);
//         this.joinMessage.set('Failed to send join request.');
//       }
//     });
//   }
// }

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../core/services/search-service';
import { RequestService } from '../../core/services/request-service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../core/services/accountservices';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
  imports: [CommonModule, FormsModule],
})
export class Details implements OnInit {

  private searchService = inject(SearchService);
  private requestService = inject(RequestService);
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private router=inject(Router)

  entityType!: 'Class' | 'User';
  entityId!: string;

  classDetails = this.searchService.classDetails;
  userDetails = this.searchService.userDetails;
  joinLoading = this.searchService.joinClassLoading;
  joinMessage = this.searchService.joinClassMessage;

  selectedClassId: string | null = null;
  currentUserClasses: any[] = [];

  ngOnInit(): void {

    this.entityId = this.route.snapshot.paramMap.get('id')!;
    this.entityType = (this.route.snapshot.queryParamMap.get('type') as 'User' | 'Class') || 'Class';

    const currentUser = this.accountService.currentUser();

    // FIX: get classes correctly based on role
    this.currentUserClasses =
      currentUser?.student?.classes ||
      currentUser?.teacher?.classes ||
      [];

    if (this.entityType === 'Class') {
      this.searchService.loadClassDetails(this.entityId);
    } else {
      this.searchService.loadUserDetails(this.entityId);
    }
  }

  handleJoinClass(): void {
    const currentUser = this.accountService.currentUser();

    if (!currentUser) {
      this.joinMessage.set('User not found.');
      return;
    }

    // ======== CLASS PAGE JOIN ========
    if (this.entityType === 'Class') {
      const classInfo = this.classDetails();
      if (!classInfo) return;

      const payload = {
        RequestDto: {
          SenderId: currentUser.user.userId,
          ReceiverId: classInfo.teacher.userId,
          ClassId: classInfo.classId,
          NotificationStatus: 'Pending'
        }
      };

      this.sendRequest(payload);
      return;
    }

    // ======== USER PAGE SEND REQUEST ========
    if (!this.selectedClassId) {
      this.joinMessage.set('Please select a class first.');
      return;
    }

    const selectedClass = this.currentUserClasses.find(c => c.classId === this.selectedClassId);

    if (!selectedClass) {
      this.joinMessage.set('Invalid class selected.');
      return;
    }

    const payload = {
      RequestDto: {
        SenderId: currentUser.user.userId,
        ReceiverId: this.userDetails()?.userId,
        ClassId: selectedClass.classId,
        NotificationStatus: 'Pending'
      }
    };

    this.sendRequest(payload);
  }

  private sendRequest(payload: any) {
    this.joinLoading.set(true);

    this.requestService.sendJoinRequest(payload).subscribe({
      next: () => {
        this.joinLoading.set(false);
        this.joinMessage.set('Request sent successfully.');
        this.router.navigate(['/dashboad'])
      },
      error: (err) => {
        console.error('Join request failed', err);
        this.joinLoading.set(false);
        this.joinMessage.set('Failed to send request.');
      }
    });
  }
}
