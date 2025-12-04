import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '../../../service/session.service';
import { ISessionBean } from '../../../model/session';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private sessionService = inject(SessionService);
  private router = inject(Router);
  
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      // Hashear la contraseña en SHA-256 antes de enviar
      const hashedPassword = await this.hashPassword(this.loginForm.value.password!);

      const credentials: ISessionBean = {
        username: this.loginForm.value.username!,
        password: hashedPassword
      };

      this.sessionService.login(credentials).subscribe({
        next: (token: string) => {
          // Validar que el token no sea null o vacío
          if (token && token !== 'null' && token.trim() !== '') {
            this.sessionService.saveToken(token);
            this.isLoading.set(false);
            this.router.navigate(['/']);
          } else {
            // El backend devolvió null (credenciales incorrectas)
            this.isLoading.set(false);
            this.errorMessage.set('Usuario o contraseña incorrectos');
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set('Usuario o contraseña incorrectos');
          console.error('Login error:', error);
        }
      });
    }
  }

  // Función para hashear la contraseña usando SHA-256
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
}
