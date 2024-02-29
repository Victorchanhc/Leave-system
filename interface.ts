

export interface Detail {
    id?: number
    name: string
    email: string
    password: string
    roles?: string
}
export interface Lesson {
    name: string
    date: Date
    start_time: string
    end_time: string
    venus: string

}

export interface PlayerDetail {
    id : number
    english_name: string
    nick_name: string
    chinese_name: string
    date_of_birth: Date
    gender: string
}

// Good to create interface for join result set
export interface HomePageList {
    id: number
    name: string
    date: Date
    start_time: string
    end_time: string
    venue: string
    player_id: number
    english_name: string
    nick_name: string
    
}