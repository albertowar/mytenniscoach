import { SupabaseClient, createClient } from '@supabase/supabase-js';
import Configuration from '@/pages/api/lib/configuration';
import { Database } from '@/lib/database.types';
import { formatRFC3339 } from 'date-fns';
import {
  PostgrestResponseFailure,
  PostgrestResponseSuccess
} from '@supabase/postgrest-js';
import { EventData } from '@/lib/types';

export enum EventTypeDAL {
  Match = 0,
  Training = 1,
  Coaching = 2,
  Gym = 3
}

export type EventDAL = {
  id: string;
  user_id: string;
  opponent_id?: string;
  created_at?: string;
  start: string;
  location?: string;
  type: EventTypeDAL;
  metadata?: EventData;
};

export type OpponentDAL = {
  id: string;
  user_id: string;
  name: string;
  created_at?: string;
};

export class MyTennisCoachRepository {
  private supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = createClient(
      Configuration.supabaseUrl,
      Configuration.supabaseKey
    );
  }

  async getEvents(userId: string): Promise<EventDAL[]> {
    const response = await this.supabase
      .from('Event')
      .select()
      .eq('user_id', userId);

    this.handleError(response);

    return response.data as EventDAL[];
  }

  async getCompletedMatches(userId: string): Promise<EventDAL[]> {
    const response = await this.supabase
      .from('Event')
      .select()
      .eq('user_id', userId)
      .eq('type', EventTypeDAL.Match)
      .not('metadata', 'is', null);
    this.handleError(response);

    return response.data as EventDAL[];
  }

  async getEvent(userId: string, eventId: string): Promise<EventDAL | null> {
    const response = await this.supabase
      .from('Event')
      .select()
      .eq('id', eventId)
      .eq('user_id', userId);

    this.handleError(response);

    const events = response.data as EventDAL[];

    if (events.length != 1) {
      return null;
    }

    return events[0];
  }

  async createEvent(event: EventDAL) {
    const response = await this.supabase.from('Event').insert(event);

    this.handleError(response);
  }

  async updateEvent(event: EventDAL) {
    const response = await this.supabase
      .from('Event')
      .update(event)
      .eq('id', event.id);
    this.handleError(response);
  }

  async deleteEvent(eventId: string) {
    const response = await this.supabase
      .from('Event')
      .delete()
      .eq('id', eventId);

    this.handleError(response);
  }

  async getOpponents(userId: string): Promise<OpponentDAL[]> {
    const response = await this.supabase
      .from('Opponent')
      .select()
      .eq('user_id', userId);

    this.handleError(response);

    return response.data as OpponentDAL[];
  }

  async getOpponent(
    userId: string,
    opponent_id: string
  ): Promise<OpponentDAL | null> {
    const response = await this.supabase
      .from('Opponent')
      .select()
      .eq('user_id', userId)
      .eq('id', opponent_id);

    this.handleError(response);

    const opponents = response.data as OpponentDAL[];

    if (opponents.length != 1) {
      return null;
    }

    return opponents[0];
  }

  async createOpponent(opponent: OpponentDAL) {
    const response = await this.supabase.from('Opponent').insert(opponent);

    this.handleError(response);
  }

  async updateOpponent(opponent: OpponentDAL) {
    const response = await this.supabase
      .from('Opponent')
      .update(opponent)
      .eq('id', opponent.id);

    this.handleError(response);
  }

  async deleteOpponent(opponentId: string) {
    const response = await this.supabase
      .from('Opponent')
      .delete()
      .eq('id', opponentId);

    this.handleError(response);
  }

  private handleError(
    response: PostgrestResponseFailure | PostgrestResponseSuccess<any>
  ) {
    if (response.status >= 400) {
      console.log(JSON.stringify(response.error));
      throw new Error('An error occurred');
    }
  }
}
