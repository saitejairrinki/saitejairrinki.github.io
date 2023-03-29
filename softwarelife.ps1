echo "Running Git Commands"
git clone git@github.com:softwarelife/softwarelife.github.io.git
rm -rf softwarelife.github.io/*
cp -r site/* softwarelife.github.io/
cd softwarelife.github.io
ls

git config --global user.email "saitejairrinki@gmail.com"
git config --global user.name "saitejairrinki"
git add .
git commit -m "$(Build.SourceVersionMessage)"
git push 