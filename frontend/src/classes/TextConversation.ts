import { nanoid } from 'nanoid';
import { Socket } from 'socket.io-client';
import { UserProfile } from '../CoveyTypes';

/**
 * A basic representation of a text conversation, bridged over a socket.io client
 * The interface to this class was designed to closely resemble the Twilio Conversations API,
 * to make it easier to use as a drop-in replacement.
 */
export default class TextConversation {
  private _socket: Socket;

  private _callbacks: MessageCallback[] = [];

  private _authorName: string;

  private _authorId: string;

  /**
   * Create a new Text Conversation
   *
   * @param socket socket to use to send/receive messages
   * @param authorName name of message author to use as sender
   */
  public constructor(socket: Socket, authorName: string, authorId:string) {
    this._socket = socket;
    this._authorName = authorName;
    this._authorId=authorId;
    this._socket.on('chatMessage', (message: ChatMessage) => {
      message.dateCreated = new Date(message.dateCreated);
      this.onChatMessage(message);
    });
  }

  private onChatMessage(message: ChatMessage) {
    if(message.receiver){
      if(this._authorId===message.receiver.id||this._authorId===message.author.id){
        this._callbacks.forEach(cb => cb(message));
      }
    }else{
      this._callbacks.forEach(cb => cb(message));
    }
    // this._callbacks.forEach(cb => cb(message));
    // when user id is specified
    // edit here
  }

  /**
   * Send a text message to this channel
   * @param message
   */
  public sendMessage(message: string,receiver?:UserProfile) {
    const msg: ChatMessage = {
      sid: nanoid(),
      body: message,
      author: {displayName:this._authorName,id:this._authorId},
      dateCreated: new Date()
    };
    if(receiver){
      msg.receiver=receiver
    }
    this._socket.emit('chatMessage', msg);
  }

  /**
   * Register an event listener for processing new chat messages
   * @param event
   * @param cb
   */
  public onMessageAdded(cb: MessageCallback) {
    this._callbacks.push(cb);
  }

  /**
   * Removes an event listener for processing new chat messages
   * @param cb
   */
  public offMessageAdded(cb: MessageCallback) {
    this._callbacks = this._callbacks.filter(_cb => _cb !== cb);
  }

  /**
   * Release the resources used by this conversation
   */
  public close(): void {
    this._socket.off('chatMessage');
  }
}
type MessageCallback = (message: ChatMessage) => void;
export type ChatMessage = {
  author: UserProfile;
  sid: string;
  body: string;
  dateCreated: Date;
  receiver?:UserProfile;
  errorMsg?:string
};
