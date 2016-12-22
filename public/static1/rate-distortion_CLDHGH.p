set term post eps enh "Arial" 26 color
set output "rate-distortion_CLDHGH.eps"
set datafile missing "-"
set key inside top left Left reverse

set auto x
#set yrange [0:1]
set grid y

set style line 1 lt 1 lc rgb "blue" lw 5
set style line 2 lt 2 lc rgb "red" lw 5
set style line 3 lt 3 lc rgb "black" lw 5
set style line 4 lt 4 lc rgb "green" lw 5
set style line 5 lt 5 lc rgb "purple" lw 5
set style line 6 lt 6 lc rgb "brown" lw 5
set style line 7 lt 7 lc rgb "orange" lw 5

set xlabel "Rate"
set ylabel "Distortion"

set style data linespoints
set boxwidth 0.9
#set xtic rotate by -45
plot 'rate-distortion_CLDHGH.txt' using 1:2 ti col ls 1, '' u 1:3 ti col ls 2
