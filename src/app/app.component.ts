import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, forkJoin, fromEvent, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, tap } from 'rxjs/operators';
import { Character } from './models/character.model';
import { Episode } from './models/episode.model';
import { ActorsService } from './services/actors.service';
import { ConfigService } from './services/config.service';

type Options = "a" | "b";
type Options2 = 1 | 2;
type Options3 = `${Options} ${Options2}`
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('button') button!: ElementRef;
  searchForm!: FormGroup;

  
  searchSubject = new Subject<string>();
  data$!: Observable<string[]>;
  searching = false;

  list: Vehiculo[] = [
    {
      Placa: 'AWA122',
      Owner: 'Ricardo  A.',
      address: {
        street: 'Calle',
        number: 12
      }
    }
  ]

  constructor(private fb: FormBuilder, private service: ActorsService, private configService: ConfigService) { }
  
  ngAfterViewInit(): void {
    fromEvent(this.button.nativeElement, 'click').subscribe( console.log )
  }

  async ngOnInit() {
    this.searchForm = this.fb.group({
      autocomplete: [null]
    });

    this.data$ = this.listenSearch();

    const [characters, episodes] = await (forkJoin([this.service.getCharacters$(), this.service.getEpisodes$()]).toPromise<[Character[], Episode[]]>())
    // console.table(characters)
    // console.table(episodes)

    const idx = this.list.filter_v2(x => {
      return  x.Placa == "AWA122";
    });

    //const result = this.list.find_v2('address', 'AWA122');
    this.test2(this.test("a 2"))

    console.log(this.configService.config);
    
  }

  test(key: Options3): (obj: {name: string}) => {} {
    return (obj: {name: string}) => {
      return key;
    };
  }

  test2(fn: (obj: {name: string}) => {}) {
    return fn({name: 'Ricardo'});
  }

  listenSearch = () => {
    return this.searchSubject.asObservable()
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(search => {
          if (!search) return of([]);
          this.searching = true;
          return this.service.getActorByPartialName$(search)
        }),
        tap(() => this.searching = false)
      );
  }

  onSearch = (value: string) => {
    this.searchSubject.next(value.trim());
  }

}

interface Vehiculo {
  Placa: string;
  Owner: string;
  address: {
    street: string;
    number: number
  }
}
declare global {
  interface Array<T> {
    filter_v2(elem: fn<T>): Array<T>;
    find_v2<TObj extends T>(key: RecursiveKeyOf<T, TObj>, value: any): T;
  }

  type fn<T> = (obj: T) => boolean;
  type RecursiveKeyOf<T, TObj extends T> = {
    [TKey in keyof TObj & (string | number)]:
      TObj[TKey] extends T
        ? `${TKey}` | `${TKey}.${RecursiveKeyOf<T, TObj[TKey]>}`
        : `${TKey}`;
  }[keyof TObj & (string | number)];
}

if (!Array.prototype.filter_v2) {
  Array.prototype.filter_v2 = function<T>(fn: fn<T>): T[] {
    const array = this;
    const result: T[] = [];

    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      const isValid = fn(element);

      isValid && result.push(element);
    }

    return result;
  }
}

// @ts-ignore
Array.prototype.find_v2 = function<T, TObj extends T>(key: RecursiveKeyOf<T, TObj>, value: any): T {
  const array = this;
  
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const exists = !!getNestedProperty(element, key); 
    if (exists) return element;
  }
}

function getNestedProperty(obj: any, desc: any) {
  var arr = desc.split(".");
  while(arr.length && (obj = obj[arr.shift()]));
  return obj;
}
