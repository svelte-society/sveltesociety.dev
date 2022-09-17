echo "here"
echo "there"
sleep 2
echo "ok"
sed -i '' 's/href="\//href=".\//g' docs/index.html 
sed -i '' 's/src="\//src=".\//g' docs/index.html
# sed -i '' 's/"_app/".\/_app/g' docs/vite-manifest.json