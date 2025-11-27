import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../core/services/search-service';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  classId!: string;
  details: any;

  constructor(private route: ActivatedRoute, private searchService: SearchService) {}

  ngOnInit(): void {
    this.classId = String(this.route.snapshot.paramMap.get('id'));

    this.loadDetails();
  }

  loadDetails() {
    const results = this.searchService.searchResults();
    this.details = results.find(item => String(item.classId) === this.classId);
  }

}
