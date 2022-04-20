var express = require('express');
var router = express.Router();
var authentication_mdl = require('../middlewares/authentication');
var session_store;
/* GET Customer page. */

router.get('/',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM employee',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('customer/list',{title:"Employee List",data:rows,session_store:req.session});
		});
         //console.log(query.sql);
     });
});

router.delete('/delete/(:id)',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		varemployee = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from employee where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, employee, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/customers');
				}
				else{
					req.flash('msg_info', 'Delete Employee Success'); 
					res.redirect('/customers');
				}
			});
		});
	});
});
router.get('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM employee where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/customers'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Employee can't be find!"); 
					res.redirect('/customers');
				}
				else
				{	
					console.log(rows);
					res.render('customer/edit',{title:"Edit Employee List ",data:rows[0],session_store:req.session});

				}
			}

		});
	});
});
router.put('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.assert('name', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_name = req.sanitize( 'name' ).escape().trim(); 
		v_gender = req.sanitize( 'gender' ).escape().trim();
		v_address = req.sanitize( 'address' ).escape().trim();
		v_dep = req.sanitize( 'dep' ).escape();
		v_position = req.sanitize( 'position' ).escape().trim();

		var employee = {
			name: v_name,
			gender: v_gender,
			address: v_address,
			dep : v_dep,
			position: v_position
		}

		var update_sql = 'update employee SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, employee, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('customer/edit', 
					{ 
						name: req.param('name'), 
						gender: req.param('gender'),
						address: req.param('address'),
						dep: req.param('dep'),
						position: req.param('position'),
					});
				}else{
					req.flash('msg_info', 'Update Employee success'); 
					res.redirect('/customers/edit/'+req.params.id);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.redirect('/customers/edit/'+req.params.id);
	}
});

router.post('/add',authentication_mdl.is_login, function(req, res, next) {
	req.assert('name', 'Please fill thee').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_name = req.sanitize( 'name' ).escape().trim(); 
		v_gender = req.sanitize( 'gender' ).escape().trim();
		v_address = req.sanitize( 'address' ).escape().trim();
		v_dep = req.sanitize('dep').escape();
		v_position = req.sanitize( 'position' ).escape().trim();

		var employee = {
			name: v_name,
			gender: v_gender,
			address: v_address,
			dep : v_dep,
			position: v_position
		}

		var insert_sql = 'INSERT INTO employee SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, employee, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('customer/add-customer', 
					{ 
						name: req.param('name'), 
						gender: req.param('gender'),
						address: req.param('address'),
						dep: req.param('dep'),
						position: req.param('position'),
						session_store:req.session,
					});
				}else{
					req.flash('msg_info', 'Create Employee success'); 
					res.redirect('/customers');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('customer/add-customer', 
		{ 
			name: req.param('name'), 
			address: req.param('address'),
			session_store:req.session
		});
	}

});

router.get('/add',authentication_mdl.is_login, function(req, res, next) {
	res.render(	'customer/add-customer', 
	{ 
		title: 'Add New Employee',
		name: '',
		gender:'',
		address:'',
		dep:'',
		position: '',
		session_store:req.session
	});
});

module.exports = router;
