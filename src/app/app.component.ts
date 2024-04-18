import {Component} from '@angular/core';
import {Subscription} from "rxjs";
import {StorageService} from "./services/storage.service";
import {AuthService} from "./services/auth.service";
import {EventBusService} from "./_shared/event-bus.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'inzynierkaFrontend';

  private roles: string[] = [];
  isLoggedIn = false;
  isLoggedInSubscription?: Subscription;

  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  showConfirmationDialog = false;

  eventBusSub?: Subscription;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private router: Router
  ) {}

  ngOnInit(): void
  {
    this.isLoggedInSubscription = this.storageService.isLoggedInObservable().subscribe(isLoggedIn => {
      this.isLoggedIn = this.storageService.isLoggedIn();
      if (this.isLoggedIn)
      {
        const user = this.storageService.getUser();
        this.roles = user.roles;
        this.username = user.username;
      }
    });

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();
        this.isLoggedIn = this.storageService.isLoggedIn();
        this.router.navigate(['/login']);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  confirmLogout()
  {
    if (confirm("Do you want to log out?"))
    {
      this.logout();
    }
    this.showConfirmationDialog = true;
  }

  hideConfirmationDialog()
  {
    this.showConfirmationDialog = false;
  }

  ngOnDestroy(): void
  {
    if (this.isLoggedInSubscription)
    {
      this.isLoggedInSubscription.unsubscribe();
    }
  }

}
