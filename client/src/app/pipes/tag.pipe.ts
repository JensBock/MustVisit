import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tag',
  pure: false
})
export class TagPipe implements PipeTransform {

  transform(value: any, args?: any): any {
  if (value){
  		var locations = value.filter(function (el) {
	  	 var tagsLowerCase = el.tags.map(function(value) {
      		return value.toLowerCase();
    	});
    	let containsAll = 0;
	  	for (let tag of args) {
  			 if (tagsLowerCase.findIndex( v => v.indexOf(tag.name.toLowerCase()) > -1) > -1 ) {
  			 	containsAll +=1
  			 }
		}
		 return containsAll==args.length? true: false;
		})
		return locations;
  	}
  }
}
