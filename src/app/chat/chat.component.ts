import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  userMessage: string = '';
  chatMessages: any[] = [];
  isQuestion:boolean=false;

  constructor(private http: HttpClient) {}

  makeChatGPTRequest(message: string): Observable<any> {
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization:
        'Bearer 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',
    });

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message },
      ],
    };

    return this.http.post<any>(url, body, { headers });
  }

  sendMessageToChatGPT(message: string) {
    this.makeChatGPTRequest(message).subscribe(
      (response) => {
        const assistantMessage = response.choices[0].message;
        this.chatMessages.push({ role: 'user', content: message });
        this.chatMessages.push({
          role: 'assistant',
          content: assistantMessage.content,
        });        
      },
      (error) => {
        console.error(error);
      }
    );
  }

  sendMessage() {
    if (this.userMessage) {
      this.sendMessageToChatGPT(this.userMessage);
      // Clear the user input after sending the message
      this.userMessage = '';
    }
  }
}
