export type MessageContent = {
  text: string,
  imgURL?: string,
}

export type Message = 
{
  senderID: string,
  content: {
    text: string,
    imgUrl?: string
  },
  createdAt: Date,
  isNewUserBlock?: boolean,
  isNewTimeStampBlock?: boolean,
}

export type MessageBox = Message & {
  isNewUserBlock?: boolean,
  isNewTimeStampBlock?: boolean,
}