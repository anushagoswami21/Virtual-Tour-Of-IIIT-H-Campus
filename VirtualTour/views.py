from django.shortcuts import render
from .models import *
import json
from django.http import HttpResponse

def im4(request):
    im=images.objects.all()
    return render(request,'VirtualTour/instructions.html',{'imd':im})

def im3(request):
    im=images.objects.all()
    myList=[8,28,29,23,31,64,69,70,73, 71,66,65,67,68,62,36,72,10,74,11]
    request.session['list']=myList
    request.session['type'] = 2
    return render(request,'VirtualTour/dignitory_tour.html',{'list':myList,'imd':im})

def im2(request):
    im=images.objects.all()
    myList=[8,28,61,23,29,56,57,58,20,60,54,55,4,16,5,25,24,6,7,14,26,
            38,37,36,18,62,17,15,63,9,64,31,32,49,48,47,10,45,43,11,27,42,13,
            12,41,2,50,51,52,53,3]
    request.session['list']=myList
    request.session['type'] = 1
    return render(request,'VirtualTour/student_tour.html',{'list':myList,'imd':im})

def im1 (request):
    s = request.GET.getlist('ID')
    route =[-1]
    graph = make_graph()
    im=images.objects.all()
    if len(s)!=0 :
        s = s[0].split(',')
        di = {}
        for key in graph:
            v = set(graph[key])
            di.update({str(key) : v})
        graph = di
        route = find_path(graph,s)
        request.session['list']=route
        request.session['type'] = 1
    if(route[0]==-1):
        return render(request,'VirtualTour/home.html',{'imd':im})
    else :
        return HttpResponse(json.dumps(route), content_type = "application/json")

def make_graph():
    d = images_graph.objects.all()
    f = {}
    for i in d :
        a = str(i.node_a_id)
        b = str(i.node_b_id)
        f.setdefault(a,[]).append(b)
        f.setdefault(b,[]).append(a)

    return f

def get_story(type , my_list):
    k = []
    pos = []
    titles=[]
    for i in my_list:
        p = general_path.objects.filter(heading=i).filter(qty=type)
        img_story =[]
        story_pos = []
        temp_t = []
        for j in p :
            img_story.append(j.descrp)
            story_pos.append([j.pos1,j.pos2,j.pos3,j.pos4])
            temp_t.append(j.title)
        k.append(img_story)
        pos.append(story_pos)
        titles.append(temp_t)

    return k,pos,titles



def dfs_paths(graph, start, goal):
    stack = [(start, [start])]
    while stack:
        (vertex, path) = stack.pop()
        for next in graph[vertex] - set(path):
            if next == goal:
                yield path + [next]
            else:
                stack.append((next, path + [next]))


def find_path(graph, nodes):
    s = []
    for i in nodes[1:]:
        d = list(dfs_paths(graph, nodes[0], i))
        for k in d :
            if(set(nodes).issubset(set(k))):
                s.append(k)
    ct = 79
    for i in s :
        if(ct>=len(i)):
            path = i
            ct = len(i)
    return path

def Index (request):
    list1=request.session['list']
    type1 = request.session['type']
    disp_img = []
    title=[]
    i=int(list1[0])
    s = images.objects.get(id=i)
    p=s.impath
    for i in list1:
        i = int(i)
        s = images.objects.get(id=i)
        disp_img.append(s.impath)
        title.append(s.name)
    res = list(map(int,list1))
    stories,markers,titles= get_story(type1,res)
    first_story=stories[0]
    iml = images.objects.all()

    return render(request,'VirtualTour/index1.html',{'list':list1,'imd':iml,'im1':p,'im':disp_img,'tt':titles[0],'all_title':titles,'st1':first_story,'mk1':markers[0],'st2':title[0],'des':stories,'mks': markers,'heading':title})
