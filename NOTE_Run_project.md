# --Run 
$ php artisan serve

# --Switched to a new branch
USER@DESKTOP-M1TVSAR MINGW64 /d/ETEC/11_1_30mns/etec-final-project (master)
$ git checkout -b nona
Switched to a new branch 'nona'

USER@DESKTOP-M1TVSAR MINGW64 /d/ETEC/11_1_30mns/etec-final-project (nona)
$


# --create databse migration
$ php artisan migrate   

  WARN  The database 'etec_laravel_db' does not exist on the 'mysql' connection.  
  Would you like to create it? (yes/no) [yes]
❯
   INFO  Preparing database.  

  Creating migration table ............................................................................................................ 89.74ms DONE

   INFO  Running migrations.  

  0001_01_01_000000_create_users_table ............................................................................................... 117.52ms DONE
  0001_01_01_000001_create_cache_table ................................................................................................ 32.59ms DONE
  0001_01_01_000002_create_jobs_table ................................................................................................. 68.25ms DONE
  2026_06_07_095447_create_personal_access_tokens_table ............................................................................... 32.14ms DONE



# --
php artisan view:clear
php artisan route:clear
php artisan serve


# 1. Install dependencies (if vendor/ missing)
composer install

# 2. Copy env (already done — skip if .env exists)
cp .env.example .env
php artisan key:generate

# 3. Run migrations (creates tables including the `role` column)
php artisan migrate:fresh

# 4. Create your admin user (run once)
php artisan tinker
>>> App\Models\User::create(['name'=>'Admin Boss','email'=>'admin@demo.com','password'=>bcrypt('password'),'role'=>'admin']);
>>> exit

# 5. Start server
php artisan serve

<!-- -- when caches error -- -->
# 1. Delete stale compiled views
php artisan view:clear

# 2. Also clear config/route cache to be safe
php artisan cache:clear
php artisan config:clear