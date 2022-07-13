#   #STATIC_URL# #HTTP_PROTOCOL# #API_URL# #SDK_URL#

rsync_dir=$1
replace_str_host=$2
replace_str_protocol=$3
env=$4
git_dir=$5
RSYNC_IP=$6
AREA=$7
replace_str_api_host=$8
replace_str_sdk_host=$9


replace_dir=$git_dir/$1
function read_dir(){
    for file in `ls $1` #注意此处这是两个反引号，表示运行系统命令
    do
    if [ -d $1/$file ] #注意此处之间一定要加上空格，否则会报错
        then
        read_dir $1/$file $2 $3 $4 $5
        else
        #echo $1/$file #在此处处理文件即可
        sed -i "s@#STATIC_URL#@$2@g" $1/$file
        sed -i "s@#HTTP_PROTOCOL#@$3@g" $1/$file
        sed -i "s@#API_URL#@$4@g" $1/$file
        sed -i "s@#SDK_URL#@$5@g" $1/$file

    fi
    done
}

read_dir $replace_dir $replace_str_host $replace_str_protocol $replace_str_api_host $replace_str_sdk_host




newdir=/root/xyxnew/$env/static
mkdir -p $newdir

mv $git_dir/* $newdir/
mv $newdir/$rsync_dir/$AREA/* $newdir/$rsync_dir/

groupadd www;
useradd -g www www;

chown -R www:www $newdir
chmod -R 744 $newdir

#rm -rf  $newdir/$rsync_dir/$AREA/*

pwd
ls -l


cd /root/xyxnew

echo  "rsync -avzR $env/static/$rsync_dir/ $RSYNC_IP::XYXNEW/"
rsync -avzR $env/static/$rsync_dir/ $RSYNC_IP::XYXNEW/

