import { Injectable, inject, signal, WritableSignal, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ClassDto } from '../../types/Notification';
import { UpdateClassDto } from '../../types/teacher';

@Injectable({
  providedIn: 'root'
})
export class TeacherClassService {

  private http = inject(HttpClient);
  private ngZone = inject(NgZone);
  private baseUrl = environment.apiUrl;

  public teacherClasses: WritableSignal<ClassDto[]> = signal([]);
  public selectedClassId: WritableSignal<string | null> = signal(null);
  public loading: WritableSignal<boolean> = signal(false);

public loadClasses(currentTeacherId: string): void {
  setTimeout(() => this.loading.set(true));

  this.http.get<ClassDto[]>(`${this.baseUrl}Class/all`).subscribe({
    next: (res) => {
      this.ngZone.run(() => {
        this.teacherClasses.set(res || []);
        if (res?.length > 0) {
          this.selectedClassId.set(res[0].classId);
        }
        setTimeout(() => this.loading.set(false));
      });
    },
    error: (err) => {
      console.error("Class not found:", err);
      this.ngZone.run(() => setTimeout(() => this.loading.set(false)));
    }
  });
}
  public selectClass(classId: string): void {
    this.selectedClassId.set(classId);
  }

  public addClass(name: string, joinName: string, desc: string, teacherId: string) {
    const payload = {
      classDto: {
        className: name,
        classJoinName: joinName,
        description: desc,
        teacherId: teacherId, 
        status: "Active"
      }
    };
    this.http.post(`${this.baseUrl}Class/create`, payload)
      .subscribe({
        next: (res: any) => {
          console.log("Class created:", res);
          this.loadClasses(teacherId);
        },
        error: (err) => {
          console.error("Create class failed:", err);
        }
      });
  }

   public updateClass(classId: string, dto: UpdateClassDto, teacherId: string) {
  return this.http.put(`${this.baseUrl}Class/${classId}`, dto);
  }

  public deleteClass(classId: string) {
    return this.http.delete(`${this.baseUrl}Class/${classId}`);
  }
}