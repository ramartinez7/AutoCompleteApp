import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, switchMap, tap } from 'rxjs/operators';
import { ActorsService } from './services/actors.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  searchForm!: FormGroup;
  
  searchSubject = new Subject<string>();
  data$!: Observable<string[]>;
  searching = false;

  constructor(private fb: FormBuilder, private service: ActorsService) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      autocomplete: [null]
    });

    this.data$ = this.listenSearch();
  }

  listenSearch = () => {
    return this.searchSubject.asObservable()
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(search => {
          if (!search) return of([]);
          this.searching = true;
          return this.service.getActorByPartialName(search)
        }),
        tap(() => this.searching = false)
      );
  }

  onSearch = (value: string) => {
    this.searchSubject.next(value.trim());
  }

}
