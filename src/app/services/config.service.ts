import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class ConfigService {

    config!: Config;

    constructor(private http: HttpClient) { }

    get = (): Observable<Config>  => {
        return this.http.get<Config>('/assets/env.json').pipe(
            tap(config => this.config = config)
        );
    }

}

export interface Config {
    api: string
}