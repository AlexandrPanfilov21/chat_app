import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { ChatService } from '../../services/chat.service';
import { WebSocketService } from '../../services/web-socket.service';
import { UserProfileService } from '../../../user-profile/services/user-profile.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import {By} from "@angular/platform-browser";

describe('ChatComponent', () => {
  let component: ChatComponent;
  let activatedRouteMock: any;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    activatedRouteMock = {
      queryParams: of({})
    };
    localStorage.setItem('User', JSON.stringify({
      id: '1',
      username: 'john_doe',
      is_online: false,
      password: 'password123'
    }));

    await TestBed.configureTestingModule({
      imports: [ChatComponent, HttpClientModule],
      providers: [
        {
          provide: ChatService,
          useValue: {
            getUserChannels: () => of([]), // Мок для метода
            getMessages: () => of([]), // Мок для метода
            getChannelById: () => of({ id: 'channelId123', name: 'Test Channel' }) // Мок для метода
          }
        },
        {
          provide: WebSocketService,
          useValue: {
            getMessages: () => of([]), // Добавляем мок для getMessages
            sendMessage: () => {} // Мок для sendMessage, если потребуется
          }
        },
        {
          provide: UserProfileService,
          useValue: {
            getUserById: () => of({ username: 'testUser' })
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ channelId: 'channelId123' })
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display placeholder when channelId is not set', fakeAsync(() => {
    activatedRouteMock.queryParams = of({}); // no channelId
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    const placeholderElement = fixture.debugElement.query(By.css('.none-chat'));
    expect(placeholderElement).toBeTruthy();
    expect(placeholderElement.nativeElement.textContent).toContain('Выберите доступный чат, чтобы начать общение');
  }));

  it('should display placeholder when channelId is an empty string', fakeAsync(() => {
    activatedRouteMock.queryParams = of({ channelId: '' }); // empty channelId
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    const placeholderElement = fixture.debugElement.query(By.css('.none-chat'));
    expect(placeholderElement).toBeTruthy();
    expect(placeholderElement.nativeElement.textContent).toContain('Выберите доступный чат, чтобы начать общение');
  }));

  it('should display placeholder when channelId is just spaces', fakeAsync(() => {
    activatedRouteMock.queryParams = of({ channelId: '   ' }); // spaces in channelId
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    const placeholderElement = fixture.debugElement.query(By.css('.none-chat'));
    expect(placeholderElement).toBeTruthy();
    expect(placeholderElement.nativeElement.textContent).toContain('Выберите доступный чат, чтобы начать общение');
  }));
});
