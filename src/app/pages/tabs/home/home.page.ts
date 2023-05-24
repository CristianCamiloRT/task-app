import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateTaskComponent } from 'src/app/shared/components/add-update-task/add-update-task.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  tasks: Task[] = []
  user = {} as User
  loading: boolean = false

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getTask()
    this.getUser()
  }

  getUser() {
    return this.user = this.utilsSvc.getElementInlocalstorage('user')
  }

  getPercentage(task: Task) {
    return this.utilsSvc.getPercentage(task)
  }

  async addOrUpdateTask(task?: Task) {
    let res = await this.utilsSvc.presentModal({
      component: AddUpdateTaskComponent,
      componentProps: { task },
      cssClass: 'add-update-modal'
    })

    if(res && res.success) {
      this.getTask()
    }
  }

  getTask() {
    let user: User = this.utilsSvc.getElementInlocalstorage('user')
    let path = `users/${user.uid}`
    this.loading = true
    let sub = this.firebaseSvc.getSubcollection(path, 'tasks').subscribe({
      next: (res: Task[]) => {
        this.tasks = res
        sub.unsubscribe()
        this.loading = false
      }
    })
  }

  corfirmDeleteTask(task: Task) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Tarea',
      message: '¿Quieres eliminar la tarea?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Confirmar',
          handler: () => {
            this.deleteTask(task)
          }
        }
      ]
    })
  }

  deleteTask(task: Task) {
    let path = `users/${this.user.uid}/tasks/${task.id}`

    this.utilsSvc.presentLoading()

    this.firebaseSvc.deleteDocument(path).then(res =>{
  
      this.utilsSvc.presentToast({
        message: 'Tarea eliminada correctamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      })
      this.getTask()
      this.utilsSvc.dismissLoading()
    }, error => {
      this.utilsSvc.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      })

      this.utilsSvc.dismissLoading()
    })
  }
}
