import RecentLog from "@/models/RecentLog"

export const createLog = async (content: string, date: any, nickname: string, link: string = '/') => {
  await RecentLog.create({
    content, date, nickname, link
  })
}