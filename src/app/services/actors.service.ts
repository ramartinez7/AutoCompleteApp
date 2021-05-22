import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Character } from "../models/character.model";
import { Episode } from "../models/episode.model";

@Injectable()
export class ActorsService {

    baseUrl: string = "https://breakingbadapi.com/api";

    constructor(private http: HttpClient) { }

    getActorByPartialName$ = (partialName: string) => {

        return this.http.get<{ name: string }[]>(`${this.baseUrl}/characters?name=${partialName}`)
            .pipe(
                map((data) => data.map((obj) => obj.name))
            );
    }

    getCharacters$ = () => {
        const characters$ = this.http.get<Character[]>('https://www.breakingbadapi.com/api/characters').pipe(
            map((result: Character[]) => {
                return result.map(({ char_id, name, birthday, img, status }) => {
                    return ({
                        char_id,
                        name,
                        birthday,
                        img,
                        status
                    } as Character)
                })
            }));

        return characters$;
    };

    getEpisodes$ = () => {
        const episodes$ = this.http.get('https://www.breakingbadapi.com/api/episodes').pipe(
            map((result) => {
                return (result as Episode[]).map(({ episode_id, title, season }) => {
                    return ({
                        episode_id,
                        title,
                        season
                    } as Episode)
                })
            })
        );
        return episodes$;
    }

}
