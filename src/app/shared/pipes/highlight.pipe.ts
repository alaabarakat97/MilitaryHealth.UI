import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  transform(value: any, search: string): string {
    if (value === null || value === undefined) return '';

    const strValue = String(value);

    if (!search) return strValue;

    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(${escapedSearch})`, 'gi');

    return strValue.replace(re, '<span class="highlight-blue">$1</span>');
  }
}
