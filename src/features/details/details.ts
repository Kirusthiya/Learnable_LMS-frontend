import { Component, inject, OnInit, signal } from '@angular/core'; // signal import பண்ணுங்க
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../core/services/search-service';
import { RequestService } from '../../core/services/request-service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../core/services/accountservices';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast-service';

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
  private router = inject(Router);
  private toast = inject(ToastService);

  entityType!: 'Class' | 'User';
  entityId!: string;

  classDetails = this.searchService.classDetails;
  userDetails = this.searchService.userDetails;
  joinLoading = this.searchService.joinClassLoading;
  joinMessage = this.searchService.joinClassMessage;

  selectedClassId: string | null = null;

  // ⭐ UPDATE 1: Signal ஆக மாற்றியுள்ளேன்
  currentUserClasses = signal<any[]>([]); 

  ngOnInit(): void {
    this.entityId = this.route.snapshot.paramMap.get('id')!;
    this.entityType = (this.route.snapshot.queryParamMap.get('type') as 'User' | 'Class') || 'Class';

    // 1. Get Current User ID
    const storedUser = this.accountService.currentUser();
    const myUserId = storedUser?.user?.userId || storedUser?.id; // ID எடுப்பது

    if (myUserId) {
      // 2. Call API to get latest data
      this.accountService.getUserById(myUserId).subscribe({
        next: (response: any) => {
          console.log('API Response:', response);

          // ⭐ UPDATE 2: Postman JSON படி 'classes' நேரடியாக இருக்கிறது.
          // user.teacher.classes என்று தேட வேண்டாம்.
          if (response.classes) {
            this.currentUserClasses.set(response.classes);
          } else {
             this.currentUserClasses.set([]);
          }
        },
        error: (err) => {
          console.error('Error fetching user classes:', err);
        }
      });
    }

    // Load page details
    if (this.entityType === 'Class') {
      this.searchService.loadClassDetails(this.entityId);
    } else {
      this.searchService.loadUserDetails(this.entityId);
    }
  }
handleJoinClass(): void {
    const currentUser = this.accountService.currentUser();

    if (!currentUser) {
      this.joinMessage.set('User not found. Please login again.');
      return;
    }

   
    const senderId = currentUser.user.userId || currentUser.id;

    if (!senderId) {
      console.error('User ID missing in current user object:', currentUser);
      this.joinMessage.set('Error: User ID not found.');
      return;
    }

    // Case 1: Joining a Class directly
    if (this.entityType === 'Class') {
      const classInfo = this.classDetails();
      if (!classInfo) return;

      const payload = {
        RequestDto: {
          SenderId: senderId, // ⭐ Fixed
          ReceiverId: classInfo.teacher.userId,
          ClassId: classInfo.classId,
          NotificationStatus: 'Pending'
        }
      };

      this.sendRequest(payload);
      return;
    }

    // Case 2: User Profile -> Joining a Class
    if (!this.selectedClassId) {
      this.joinMessage.set('Please select a class first.');
      return;
    }

    const selectedClass = this.currentUserClasses().find(c => c.classId === this.selectedClassId);

    if (!selectedClass) {
      this.joinMessage.set('Invalid class selected.');
      return;
    }

    // ⭐ FIX 2: Receiver ID (User Profile Owner) எடுப்பது
    const receiverId = this.userDetails()?.userId;
    
    if (!receiverId) {
        this.joinMessage.set('Target user not found.');
        return;
    }

    const payload = {
      RequestDto: {
        SenderId: senderId, // ⭐ Fixed
        ReceiverId: receiverId,
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
        this.toast.success('Request sent successfully.');
        this.router.navigate(['/dashboad']);
      },
      error: (err) => {
        this.joinLoading.set(false);
        this.joinMessage.set('Failed to send request.');
        this.toast.error('Failed to send request.');
      }
    });
  }
}