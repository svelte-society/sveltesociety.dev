echo "here"
echo "there"
sleep 2
echo "ok"
sed -i'' -e 's/href="\//href=".\//g' docs/index.html 
sed -i'' -e 's/src="\//src=".\//g' docs/index.html
sed -i'' -e 's/"_app="\//"_app=".\//g' docs/vite-manifest.json
sed -i'' -e 's/michael\//kateryna\//g' tests/datei.html 

sed -i'' -e 's/sed/michael/kateryna/' tests/datei.html
sed 's/sed/michael/kateryna/' tests/datei.html

sed 's/sed/FindWord/ReplaceWord/5' ./tests/file.txt
sed -i '' 's/FindWord/ReplaceWord/5' ./tests/file.txt



sed -i '' 's/"_app=/".\/_app=/g' docs/vite-manifest.json
sed -i '' 's/michael/kateryna/g' tests/datei.html