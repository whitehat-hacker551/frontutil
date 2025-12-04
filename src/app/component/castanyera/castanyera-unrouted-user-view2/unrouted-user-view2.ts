import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ICastanyera } from '../../../model/castanyera';
import { TrimPipe } from '../../../pipe/trim-pipe';
import { DatetimePipe } from '../../../pipe/datetime-pipe';

@Component({
  selector: 'castanyera-app-unrouted-user-view2',
  imports: [TrimPipe, RouterLink, DatetimePipe],
  templateUrl: './unrouted-user-view2.html',
  styleUrl: './unrouted-user-view2.css',
})
export class CastanyeraUnroutedUserView2 implements OnInit {
  @Input() oCastanyera: ICastanyera | null = null;

  iconClass: string = 'bi bi-newspaper';

  private router = inject(Router);

  ngOnInit(): void {
    const icons: string[] = [
      'bi bi-newspaper',
      'bi bi-eye',
      'bi bi-journal-text',
      'bi bi-card-text',
      'bi bi-file-earmark-text',
      'bi bi-book',
    ];
    this.iconClass = icons[Math.floor(Math.random() * icons.length)];
  }

  goToPost(id: number | undefined | null) {
    console.debug('goToPost clicked, id=', id);
    if (!id) {
      console.warn('goToPost: id is empty, navigation aborted');
      return false;
    }
    this.router.navigate(['/castanyera/post', id]);
    return false;
  }
}
