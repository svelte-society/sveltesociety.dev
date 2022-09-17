echo "here"
echo "there"
sleep 2
echo "ok"
sed -i'' -e 's/href="\//href=".\//g' docs/index.html 
sed -i'' -e 's/src="\//src=".\//g' docs/index.html