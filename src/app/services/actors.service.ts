import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { map, tap } from "rxjs/operators";

@Injectable()
export class ActorsService {

    baseUrl: string = "https://breakingbadapi.com/api";
    memory!: string[] | null;

    constructor(private http: HttpClient) {}

    getActorByPartialName = (partialName: string) => {

        return this.http.get<{name:string}[]>(`${this.baseUrl}/characters?name=${partialName}`)
            .pipe(
                map((data) => data.map((obj) => obj.name)),
                tap((data) => this.memory = data)
            );
    }

}