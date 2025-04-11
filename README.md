# finance-manager

App for managing personal finances. Allows users to enter expenses and earnings and have them analyzed.

So far, the analysis part is just displaying a chart of expenses and earnings for each month; however the data can be adjusted for inflation, based on data from the [European Central Bank](https://data.ecb.europa.eu/help/api/data).

The only supported currency is the Polish Złoty (PLN).

## How to run locally
You must seperately run the frontend and backend parts.

##### Frontend:
Enter the `frontend` directory and run:
```sh
npm install # install dependencies
npm run dev # run the development server
```
Then open the browser on the specified port.

##### Backend:
Enter the `backend` directory and run:
```sh
python -m venv venv # create a virtual environment
source venv/bin/activate # activate the environment
pip install -r requirements.txt # install dependencies
echo "DJANGO_SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')" > .env
# create a .env file with a Django secret key (required for running)
python manage.py migrate # create database and apply migrations
python manage.py runserver # run the development server
```


You're good to go! Register a user and try it out.
