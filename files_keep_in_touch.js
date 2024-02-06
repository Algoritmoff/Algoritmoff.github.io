var keepers = []
function file_keeper(code, path,is_teacher) {
  this.code = code
  this.path = path
  this.is_teacher = is_teacher
}

function find_file(path,make_new,path_to,is_teacher){
  if(path[path.length-1]!='/'){
  file = keepers.findIndex(element => element.path == path);
  if(file == -1){
    if(make_new){
      keepers.push(new file_keeper(null, path,is_teacher));
    }
    return file;
  }
  else{
    if(path_to!=undefined && path_to!=null){

      slice_path_here = path.lastIndexOf('/')
      slice_path_to_here = path_to.lastIndexOf('/')
      path_to = path_to.slice(0, slice_path_to_here) + path.slice(slice_path_here, path.length)
      if ($( "div[path='"+path_to+"']" ).length ==0){
        keepers[file].path = path_to
      }
    }
    return file;
  }
}
return -2;
}
