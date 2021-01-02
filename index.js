const express=require('express');
const app=express();
const bp=require ('body-parser')
const sqlite= require('sqlite3')

const db= new sqlite.Database(__dirname+'/db.sqlite',(err)=>{
    if(err) throw err
    console.log('Database berhasil dikoneksikan')
})
db.serialize(()=>{
    const sql=`
        create table if not exists kontak (
            id integer primary key autoincrement,
            nama varchar(50) not null,
            nohp varchar (20) not null
        )
    `
    db.run(sql,(err)=>{
        if (err) throw err
    })
})


app.set('view engine','ejs')
app.set('views', __dirname + '/views')
app.use(bp.urlencoded({extended:false}))

app.get('/',(req,res)=>{
    //menampilkan list
    db.serialize(()=>{
        const sql= `select * from kontak`
        db.all(sql,(err,rows)=>{
            if (err) throw err
            res.render('index.ejs',{
                kontak:rows
            })
        })
    })
})

app.get('/:id',(req,res)=>{
    //menampilkan detail
    const {id}=req.params
    db.serialize(()=>{
        const sql= `select * from kontak where id=${id}`
        db.get(sql,(err,row)=>{
            if (err) throw err
            res.render('detail.ejs',{
                kontak:row
            })
        })
    })
    
})

app.get('/:id/edit',(req,res)=>{
    //mengedit sebuah data
    const {id}=req.params
    db.serialize(()=>{
        const sql= `select * from kontak where id=${id}`
        db.get(sql,(err,row)=>{
            if (err) throw err
            res.render('edit.ejs',{
                kontak:row
            })
        })
    })
})

app.post('/:id/edit',(req,res)=>{
    //menyimpan data setelah diedit
    const {id}=req.params
    const {nama,nohp}=req.body
    db.serialize(()=>{
        const sql= `update kontak set nama='${nama}',nohp='${nohp}' where id=${id}`
        db.run(sql,(err)=>{
            if (err) throw err
            res.redirect('/')
        })
    })
})

app.get('/:id/delete',(req,res)=>{
    //menghapus data
    const {id}=req.params
    db.serialize(()=>{
        const sql= `delete from kontak where id=${id}`
        db.run(sql,(err)=>{
            if (err) throw err
            res.redirect('/')
        })
    })
    
})
app.post ('/',(req,res)=>{
    //membuat data
    const {nama,nohp}=req.body
    db.serialize(()=>{
        const sql= `insert into kontak(nama,nohp) values ('${nama}','${nohp}')`
        db.run(sql,(err)=>{
            if (err) throw err
            res.redirect('/')
        })
    })
})




app.listen(8080,()=>{
 
    console.log('aplikasi berhasil dijalankan')
})