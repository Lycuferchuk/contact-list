import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from '../models/contact.interface';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: Contact[], searchText: string): Contact[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(item => {
      return item.firstName.toLocaleLowerCase().includes(searchText);
    });
  }
}
