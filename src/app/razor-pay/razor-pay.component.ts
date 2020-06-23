import { Component, OnInit, NgZone } from '@angular/core';
import { WindowRefService } from '../window-ref.service';
import { PaymentInfoService } from '../payment-info.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-razor-pay',
  templateUrl: './razor-pay.component.html',
  styleUrls: ['./razor-pay.component.css']
})
export class RazorPayComponent implements OnInit {
  totalAmount = this.amt.totalAmount;
  rcpt_id: string = '1';
	
  checkout_result;
  verified;
  lst = {}
  
	checkout_end(matter) {
		this.checkout_result = matter;
		this.verifysign(matter);
	}
  

  constructor(
    private zone: NgZone,
    private winRef: WindowRefService,
    private amt: PaymentInfoService,
    private router: Router,
    private toaster:ToastrService,
    private http:HttpClient,
  ) {
    this.totalAmount = this.amt.totalAmount;
    console.log(this.totalAmount)
  }


  return(){
    if (confirm("Do you wish to go back?")){
	  this.router.navigate(["shop"]);
	  this.toaster.success("Redirected successfully")
    }
     
  }

  ngOnInit() {
    this.totalAmount = this.amt.totalAmount
  }

  public initPay() {
   
		let data = {
      		amount: this.amt.totalAmount*100,
			currency: 'INR',
			receipt: this.rcpt_id,
			payment_capture: 1
		};
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		this.http.post('http://localhost:8080/api/checkout', data, { headers }).subscribe((v) => {
			let order_id = v['id'];
			console.log(order_id);
			this.openrazor(order_id);
			
		});
  }
  

	openrazor(id) {
		let options = {
			key: 'rzp_live_eH6oSFaPlWJcF8', 
			amount: this.amt.totalAmount*100, 
			currency: 'INR',
			name: 'Krishna',
			description: 'Test Transaction',
			image:
				'data:image/png;base64,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',
			order_id: id,
			handler: (response) => {
				this.checkout_end(response);
			},
		
			notes: {
				address: 'Razorpay Corporate Office'
			},
			theme: {
			
				color: '#1e90ff'
			}
    };
    this.lst = options;
		let rzp1 = new this.winRef.nativeWindow.Razorpay(options);
		rzp1.open();
  }
  

	verifysign(data) {
		console.log(data);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		this.http.post('http://localhost:8080/api/verify', data, { headers }).subscribe((v) => {
			if (v) {
				console.log(v);
				console.log(this.amt.details)
				this.verified = true;
				
			} else {
				this.verified = false;
			}
		});
		
		this.zone.run(()=> {
			this.toaster.success("Payment Successful")
			this.amt.getDetails(data)
			this.router.navigate(["/result"])
		})
		
	}


}
