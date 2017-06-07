
NOCOLOR='\033[0m'
REDCOLOR='\033[37;41m'
GREENCOLOR='\033[34;42m'

DIR=`pwd`
NAME=$(basename "$DIR")
TITLE="{headtitle}"

cp "$DIR/../index.template" "$DIR/index.template"
sed -i "s/$TITLE/$NAME/g" "$DIR/index.template"
echo -e "$GREENCOLOR copy index.html.$NOCOLOR"
echo -e " "

cp -R "$DIR/assets/" "$DIR/../build/$NAME/assets/"
echo -e "$GREENCOLOR copy assets.$NOCOLOR"
echo -e " "

cp "$DIR/../gulpfile.js" "$DIR/gulpfile.js"
echo -e "$GREENCOLOR copy gulpfile.js.$NOCOLOR"
echo -e " "

echo -e "$REDCOLOR gulp.$NOCOLOR"
echo -e " "
gulp

rm -f "$DIR/gulpfile.js"
rm -f "$DIR/index.template"