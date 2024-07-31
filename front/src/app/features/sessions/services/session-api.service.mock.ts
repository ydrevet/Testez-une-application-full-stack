import {Observable, of} from "rxjs";
import {Session} from "../interfaces/session.interface";

export class MockSessionApiService {
  public all(): Observable<Session[]> {
    const mockSessions: Session[] = [
      {
        id: 1,
        name: "Session 1",
        description: "Session 1 description",
        date: new Date(2024, 1, 1),
        teacher_id: 1,
        users: [1],
        createdAt: new Date(2024, 1, 2),
        updatedAt: new Date(2024, 1, 3)
      },
      {
        id: 2,
        name: "Session 2",
        description: "Session 2 description",
        date: new Date(2024, 2, 1),
        teacher_id: 1,
        users: [1],
        createdAt: new Date(2024, 2, 2),
        updatedAt: new Date(2024, 2, 3)
      }
    ];
    return of(mockSessions);
  }
}
