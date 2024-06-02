import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: number): string {
    if (value == null || value < 0) {
      return '';
    }

    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);

    let formattedTime = '';
    if (hours > 0)
    {
      formattedTime += `${hours}h `;
    }
    if (minutes > 0 || hours === 0)
    {
      formattedTime += `${minutes}min`;
    }

    return formattedTime.trim();
  }

}
