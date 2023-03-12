# 以官方的nginx镜像为基础进行构建
FROM nginx
# 将当前dockerfile所在目录下的dist目录的内容拷贝到容器的/usr/share/nginx/html/下
COPY dist/ /usr/share/nginx/html/
