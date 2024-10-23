docker build -t tic-tac-toe-back .
docker run --env-file .env -p 3000:3000 tic-tac-toe-back

push image
docker tag tic-tac-toe-back:latest nixblack/tic-tac-toe-back:v1
docker push nixblack/tic-tac-toe-back:v1

in server
docker pull nixblack/tic-tac-toe-back:v1
docker run --env-file .env -p 3000:3000 nixblack/tic-tac-toe-back:v1


frontend
npm run build
npm install -g serve
serve -s dist -l 8080


