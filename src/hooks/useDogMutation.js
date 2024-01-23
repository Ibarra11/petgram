import { useMutation, useQueryClient } from "@tanstack/react-query";
export default function useDogMutation(mutationFn, optomisticUpdate) {
  const queryClient = useQueryClient();
  const addLikeMutation = useMutation({
    mutationFn,
    onMutate: async ({ imageId }) => {
      await queryClient.cancelQueries({ queryKey: ["dogs"] });
      const previousDogs = queryClient.getQueryData(["dogs"]);
      const nextDogPages = previousDogs.pages.map((page) => {
        if (page.find((dog) => dog.id === imageId)) {
          return page.map((dog) => {
            if (dog.id === imageId) {
              return { ...dog, ...optomisticUpdate };
            }
            return dog;
          });
        }
        return page;
      });
      const nextDogs = {
        ...previousDogs,
        pages: nextDogPages,
      };

      queryClient.setQueryData(["dogs"], nextDogs);

      return { previousDogs, nextDogs };
    },
    onError: (err, nextDogs, context) => {
      console.log(err);
      queryClient.setQueryData(["dogs"], context.previousDogs);
    },
    onSettled: (newDog) => {
      queryClient.invalidateQueries({ queryKey: ["dogs"] });
    },
  });
  return addLikeMutation;
}
