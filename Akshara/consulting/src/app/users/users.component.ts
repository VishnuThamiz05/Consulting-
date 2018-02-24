import { Component, OnInit } from '@angular/core';


import {UsersService} from "./shared/users.service";
import {Employee} from "./shared/user";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'table-demo',
	  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  public rows:Array<any> = [];
  public columns:Array<any> = [
		 
	 
    {title: 'First Name', name: 'firstName', filtering: {filterString: '', placeholder: 'Filter by firstName'}},
    {title: 'Last Name',  name: 'lastName', filtering: {filterString: '', placeholder: 'Filter by last Name'}},
    {title: 'Aadhar No', className: ['office-header', 'text-success'], filtering: {filterString: '', placeholder: 'Filter by Aadhar No.'}, name: 'aadharNo', sort: 'asc'},
    {title: 'Mobile No.', name: 'mobileNo', sort: '', filtering: {filterString: '', placeholder: 'Filter by MobileNo.'}},
    {title: 'Email', className: 'text-warning', name: 'email', filtering: {filterString: '', placeholder: 'Filter by Email.'}},
    
  ];
  public page:number = 1;
  public itemsPerPage:number = 10;
  public maxSize:number = 5;
  public numPages:number = 1;
  public length:number = 0;
  
  private data:Array<Employee> = [];


  public constructor(private usersService: UsersService,   private router: Router,
		    private route: ActivatedRoute,) {
    
  }
  



  public ngOnInit():void {
	  this.usersService.getUsers()
      .subscribe(
    		  
    	data => {
    	  this.data = data.content;
    	  this.length = this.data.length;
    	
    	
    	//  console.log(data);
    	  this.onChangeTable(this.config, true);
    	 
    	  
    	  
    	},
    	  (error) => console.error(error));
   
  }
  
  public config:any = {
    paging: true,
    idRow : null,
    sorting: {columns: this.columns},
    filtering: {filterString: ''},
    className: ['table-striped', 'table-bordered']
  };

  public editConfig: any = {
    edit: {
      className: 'btn btn-rounded btn-success',
      icon: 'fa fa-pencil-square'
    },
    delete: {
      className: 'btn btn-danger',
      title: 'Delete'
    },
    select: {
      name: 'selection',
      keyProperty: 'name'
    }
  };

 

 

  

  public changePage(page:any, data:Array<any> = this.data):Array<any> {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  public changeSort(data:any, config:any):any {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName:string = void 0;
    let sort:string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous:any, current:any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  public changeFilter(data:any, config:any):any {
    let filteredData:Array<any> = data;
    this.columns.forEach((column:any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item:any) => {
        	if(item[column.name])
          return item[column.name].match(column.filtering.filterString);
        });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item:any) =>
        item[config.filtering.columnName].match(this.config.filtering.filterString));
    }

    let tempArray:Array<any> = [];
    filteredData.forEach((item:any) => {
      let flag = false;
      this.columns.forEach((column:any) => {
        if (item[column.name].toString().match(this.config.filtering.filterString)) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    return filteredData;
  }

  public onChangeTable(config:any, page:any = {page: this.page, itemsPerPage: this.itemsPerPage}):any {
    console.log(config);
    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }

    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.changeFilter(this.data, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.length = sortedData.length;
  }

  public onCellClick(data: any): any {
	  console.log(data);
	    if(data.column == 'firstName'){
	    	 this.router.navigate(['users/'+ data.row.id])
	    }
  }

  public onEditClick(row: any): any {
    console.log(row);
  }

 
	
  public onDeleteClick(row: any): any {
    console.log("delete clciked");
    
    var removeByAttr = function(arr, attr, value){
	    var i = arr.length;
	    while(i--){
	       if( arr[i] 
	           && arr[i].hasOwnProperty(attr) 
	           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

	           arr.splice(i,1);

	       }
	    }
	    return arr;
	};
	
  
        if (confirm("Are you sure you want to delete " + row.firstName + "?")) {
        

          this.usersService.deleteUser(row.id)
            .subscribe(null,
             null
                
              );
       //   this.data.splice(row.id , 1);
          removeByAttr(this.data, 'id', row.id);
          this.onChangeTable(this.config, true);
        }
        
  }
  

  public onSelectChange(data: any): any {
    console.log(data);
  }

  public onSortChanged(column: any): any {
    console.log(column);
  }

  public onFilterChanged(column: any): any {
    console.log(column);
  }
  
  prepareNewWmpolyee(){
	  this.router.navigate(['users/new'])
  }
}