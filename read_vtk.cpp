#include<iostream>
#include<string>
#include<fstream>
#include<sstream>
using namespace std;
#include<vector>

//g++ -std=c++11 

int main(int argc, char* argv[]) {


    ifstream fileIn;
    fileIn.open("2009_004315__80_200_2_40.vtk");
    string line;
    std::vector<std::vector<string> > content_parseado;
    int count_line_blank=0;

     while (getline(fileIn,line))
    {

        string item;
        std::stringstream sstr(line);
        std::vector<string> line_parsed;
        
        if (line == ""){
           count_line_blank++;
           cout<<line<<endl;
        } 
        if (count_line_blank == 2)
        {
            break;
        }

        // Read in an item
        
        while (getline(sstr, item, ' '))
        {
            line_parsed.push_back(item);
        }
        content_parseado.push_back(line_parsed);
        
    }
    cout<<"c:"<<count_line_blank<<endl;
    
    ofstream cout("2009_004315.mesh");
    for (int i = 6; i < content_parseado.size(); ++i)
    //or (int i = 6; i < 8; ++i)
    {   
            string x_ = content_parseado[i][1];
            string y_ = content_parseado[i][0];
            
            cout<<"["<<x_<<","<<y_<<"], ";
    }
    cout.close();

return 1;
}